import express from 'express';
import twilio from 'twilio';
import { prisma } from '../lib/prisma.js';

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
    const { CallSid, RecordingUrl } = req.body;
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Provide immediate AI response for room booking
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for your interest in booking a room with us! I would be happy to help you with that. Our Kiyaku Smart Hotel offers beautiful rooms with modern amenities. We have standard rooms, deluxe rooms, and suites available. All rooms include complimentary WiFi, breakfast, and 24-hour room service. What type of room are you interested in, and what dates would you like to stay?'
    );
    
    // Allow for another message
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Please tell me your preferred dates and room type after the tone, and press pound when finished.'
    );
    
    twiml.record({
      transcribe: true,
      transcribeCallback: '/api/twilio/transcription',
      maxLength: 30,
      finishOnKey: '#',
      action: '/api/twilio/handle-followup',
      method: 'POST',
    });

    res.type('text/xml');
    res.send(twiml.toString());
    
    console.log('✅ AI response provided for call:', CallSid);
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

// Handle follow-up messages
twilioRoutes.post('/handle-followup', async (req, res) => {
  try {
    const twiml = new twilio.twiml.VoiceResponse();
    
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Perfect! I have received your room booking details. Our reservations team will contact you within the next hour to confirm your booking and provide you with a confirmation number. Thank you for choosing Kiyaku Smart Hotel. Have a wonderful day!'
    );
    
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('❌ Follow-up handling error:', error);
    
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for calling Kiyaku Smart Hotel.'
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