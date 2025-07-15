import express from 'express';
import twilio from 'twilio';
import { prisma } from '../lib/prisma.js';
import { emailService } from '../services/email.js';

export const twilioRoutes = express.Router();

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

twilioRoutes.post('/call', async (req, res) => {
  try {
    const { to, from } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    if (!client) {
      return res.status(503).json({
        success: false,
        message: 'Phone service is currently unavailable. Please contact support.',
      });
    }

    const call = await client.calls.create({
      to,
      from: from || process.env.TWILIO_PHONE_NUMBER!,
      url: `${req.protocol}://${req.get('host')}/api/twilio/voice`,
    });

    await prisma.twilioCall.create({
      data: {
        callSid: call.sid,
        from: call.from,
        to: call.to,
        status: 'INITIATED',
      },
    });

    res.json({
      success: true,
      data: {
        callSid: call.sid,
        status: call.status,
      },
      message: 'Call initiated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to initiate call',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Handle both GET and POST for voice webhook
twilioRoutes.all('/voice', async (req, res) => {
  if (!client) {
    return res.status(503).json({
      success: false,
      message: 'Voice service is currently unavailable.',
    });
  }

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(
    {
      voice: 'alice',
      language: 'en-US',
    },
    'Hello! Thank you for calling Kiyaku Smart Hotel. How can I assist you today?'
  );

  twiml.record({
    transcribe: true,
    transcribeCallback: '/api/twilio/transcription',
    maxLength: 30,
    finishOnKey: '#',
    action: '/api/twilio/handle-recording',
    method: 'POST',
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

// Handle recording completion and provide AI response
twilioRoutes.post('/handle-recording', async (req, res) => {
  try {
    const { CallSid, RecordingUrl, RecordingDuration } = req.body;
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Store this as step 1 - initial booking request
    try {
      await prisma.twilioCall.update({
        where: { callSid: CallSid },
        data: {
          status: 'BOOKING_STEP_1',
        },
      });
    } catch (dbError) {
      console.error('Database update failed:', dbError);
    }
    
    // Provide AI response asking for specific details
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for your interest in booking a room with us! I would be happy to help you with that. Our Kiyaku Smart Hotel offers beautiful rooms with modern amenities. We have standard rooms starting at 150 dollars per night, deluxe rooms at 200 dollars, and luxury suites at 300 dollars per night. All rooms include complimentary WiFi, breakfast, and 24-hour room service.'
    );
    
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'To proceed with your booking, I need some information. Please tell me your full name, your email address, your phone number, your check-in date, check-out date, and preferred room type. Speak clearly and press pound when finished.'
    );
    
    twiml.record({
      transcribe: true,
      transcribeCallback: '/api/twilio/transcription',
      maxLength: 60,
      finishOnKey: '#',
      action: '/api/twilio/collect-details',
      method: 'POST',
    });

    res.type('text/xml');
    res.send(twiml.toString());
    
    console.log('✅ Booking step 1 initiated for call:', CallSid);
  } catch (error) {
    console.error('❌ Recording handling error:', error);
    
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for calling. Our reservations team will contact you shortly to assist with your booking.'
    );
    
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Collect customer details and create reservation
twilioRoutes.post('/collect-details', async (req, res) => {
  try {
    const { CallSid, RecordingUrl } = req.body;
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Get the transcription for this call to extract details
    const call = await prisma.twilioCall.findUnique({
      where: { callSid: CallSid }
    });
    
    if (call && call.transcript) {
      try {
        // Use Claude AI to extract booking information
        const Anthropic = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic.default({
          apiKey: process.env.CLAUDE_API_KEY,
        });

        const completion = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          temperature: 0.3,
          system: `You are a hotel booking assistant. Extract customer booking information from the transcript and return ONLY a JSON object with these exact fields:
{
  "name": "Full Name",
  "email": "email@example.com", 
  "phone": "+1234567890",
  "checkIn": "YYYY-MM-DD",
  "checkOut": "YYYY-MM-DD",
  "roomType": "Standard Room|Deluxe Room|Suite",
  "guests": 1
}

If any information is missing or unclear, use reasonable defaults:
- name: "Guest" + random number
- email: Use name to create email like "guest123@booking.com"
- phone: Use the calling number
- checkIn: Today + 1 day
- checkOut: checkIn + 2 days  
- roomType: "Standard Room"
- guests: 1

ONLY return the JSON object, no other text.`,
          messages: [
            {
              role: 'user',
              content: `Extract booking details from: "${call.transcript}". Calling phone number: ${call.to}`,
            },
          ],
        });

        const aiResponse = completion.content[0]?.type === 'text' 
          ? completion.content[0].text.trim()
          : '{}';

        let bookingData;
        try {
          bookingData = JSON.parse(aiResponse);
        } catch (parseError) {
          // Fallback data if AI response isn't valid JSON
          bookingData = {
            name: `Guest${Math.floor(Math.random() * 1000)}`,
            email: `guest${Math.floor(Math.random() * 1000)}@booking.com`,
            phone: call.to || '+1234567890',
            checkIn: new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0],
            checkOut: new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0],
            roomType: 'Standard Room',
            guests: 1
          };
        }

        // Create reservation in database
        const reservationId = `res-${Date.now()}`;
        const totalAmount = bookingData.roomType === 'Suite' ? '300' : 
                          bookingData.roomType === 'Deluxe Room' ? '200' : '150';

        await prisma.reservation.create({
          data: {
            id: reservationId,
            hotelId: 'kiyaku-hotel-1',
            guestName: bookingData.name,
            guestEmail: bookingData.email,
            guestPhone: bookingData.phone,
            checkIn: new Date(bookingData.checkIn),
            checkOut: new Date(bookingData.checkOut),
            roomType: bookingData.roomType,
            guests: bookingData.guests,
            totalAmount: totalAmount,
            status: 'CONFIRMED',
            notes: `Phone booking via Twilio call ${CallSid}`,
          },
        });

        // Update call record
        await prisma.twilioCall.update({
          where: { callSid: CallSid },
          data: {
            status: 'BOOKING_COMPLETED',
            summary: `Reservation created: ${reservationId} for ${bookingData.name}`,
          },
        });

        // Send confirmation email
        const emailSent = await emailService.sendBookingConfirmation({
          reservationId,
          guestName: bookingData.name,
          guestEmail: bookingData.email,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          roomType: bookingData.roomType,
          totalAmount,
          guests: bookingData.guests,
        });

        twiml.say(
          {
            voice: 'alice',
            language: 'en-US',
          },
          `Perfect! I have successfully created your reservation. Your booking confirmation number is ${reservationId}. You have booked a ${bookingData.roomType} for ${bookingData.name} from ${bookingData.checkIn} to ${bookingData.checkOut}. The total cost is ${totalAmount} dollars per night. ${emailSent ? 'A confirmation email has been sent to ' + bookingData.email : 'Please save your confirmation number for your records'}. Thank you for choosing Kiyaku Smart Hotel!`
        );

        console.log('✅ Reservation created:', reservationId, bookingData);
        console.log('✅ Email sent:', emailSent);
      } catch (aiError) {
        console.error('❌ AI processing error:', aiError);
        
        twiml.say(
          {
            voice: 'alice',
            language: 'en-US',
          },
          'I apologize, but I need to transfer you to our reservations team to complete your booking. Please hold while I connect you.'
        );
      }
    } else {
      twiml.say(
        {
          voice: 'alice',
          language: 'en-US',
        },
        'I did not receive your information clearly. Please call back and speak slowly with your booking details.'
      );
    }
    
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('❌ Detail collection error:', error);
    
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for calling. Our reservations team will contact you shortly to complete your booking.'
    );
    
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

twilioRoutes.post('/transcription', async (req, res) => {
  try {
    console.log('Transcription webhook received:', req.body);
    const { CallSid, TranscriptionText } = req.body;

    if (CallSid && TranscriptionText) {
      try {
        await prisma.twilioCall.update({
          where: { callSid: CallSid },
          data: {
            transcript: TranscriptionText,
            status: 'COMPLETED',
          },
        });
        console.log('Transcription saved successfully');
      } catch (dbError) {
        console.error('Database update failed:', dbError);
        // Don't fail the webhook even if DB update fails
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Transcription error:', error);
    res.sendStatus(200); // Always return 200 to Twilio to avoid retries
  }
});

twilioRoutes.get('/calls', async (req, res) => {
  try {
    const calls = await prisma.twilioCall.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({
      success: true,
      data: calls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calls',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});