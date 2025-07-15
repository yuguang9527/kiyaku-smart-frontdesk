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

twilioRoutes.post('/voice', async (req, res) => {
  if (!client) {
    return res.status(503).json({
      success: false,
      message: 'Voice service is currently unavailable.',
    });
  }

  const twiml = new twilio.twiml.VoiceResponse();

  // Welcome message
  twiml.say(
    {
      voice: 'alice',
      language: 'en-US',
    },
    'Hello! Thank you for calling Kiyaku Smart Hotel. I am your AI assistant ready to help with room bookings, hotel amenities, and any questions you may have. Please speak after the tone, and press pound when finished.'
  );

  // Record user input
  twiml.record({
    maxLength: 30,
    finishOnKey: '#',
  });

  // Simple response after recording
  twiml.say(
    {
      voice: 'alice', 
      language: 'en-US',
    },
    'Thank you for your message about room booking. Our hotel offers standard rooms, deluxe rooms, and suites, all with complimentary breakfast and WiFi. Our team will contact you shortly to assist with your reservation. Thank you for calling Kiyaku Smart Hotel.'
  );

  res.type('text/xml');
  res.send(twiml.toString());
});

// Handle recording and generate AI response
twilioRoutes.post('/handle-recording', async (req, res) => {
  try {
    const { CallSid, RecordingUrl } = req.body;
    
    const twiml = new twilio.twiml.VoiceResponse();
    
    // Simple AI response without complex processing
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for your message about room booking. I would be happy to help you with that. Our hotel has various room types available including standard rooms, deluxe rooms, and suites. All rooms include complimentary breakfast and WiFi. For specific availability and pricing, I can connect you with our reservations team. Would you like me to transfer your call?'
    );
    
    // Option to record another message
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Press 1 to speak with our reservations team, or press 2 to leave another message.'
    );
    
    twiml.gather({
      numDigits: 1,
      action: '/api/twilio/handle-choice',
      method: 'POST',
    });

    res.type('text/xml');
    res.send(twiml.toString());
    
    console.log('✅ Recording handled for call:', CallSid);
  } catch (error) {
    console.error('❌ Recording handling error:', error);
    
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for calling. Our team will assist you shortly.'
    );
    
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Handle user choices
twilioRoutes.post('/handle-choice', async (req, res) => {
  const { Digits } = req.body;
  const twiml = new twilio.twiml.VoiceResponse();
  
  if (Digits === '1') {
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Connecting you to our reservations team now. Please hold.'
    );
    // In real implementation, this would transfer to a human agent
  } else if (Digits === '2') {
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Please leave your message after the tone.'
    );
    twiml.record({
      maxLength: 30,
      finishOnKey: '#',
      action: '/api/twilio/handle-recording',
      method: 'POST',
    });
  } else {
    twiml.say(
      {
        voice: 'alice',
        language: 'en-US',
      },
      'Thank you for calling Kiyaku Smart Hotel. Have a great day!'
    );
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
});

twilioRoutes.post('/transcription', async (req, res) => {
  try {
    const { CallSid, TranscriptionText } = req.body;

    if (CallSid && TranscriptionText) {
      // Save transcription to database
      try {
        await prisma.twilioCall.update({
          where: { callSid: CallSid },
          data: {
            transcript: TranscriptionText,
            status: 'COMPLETED',
          },
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        // Continue with AI response even if DB update fails
      }

      // Generate Claude AI response
      try {
        const Anthropic = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic.default({
          apiKey: process.env.CLAUDE_API_KEY,
        });

        const completion = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          temperature: 0.7,
          system: `You are a helpful hotel assistant for Kiyaku Smart Hotel. This is a phone conversation. Keep responses concise and natural for voice. Provide helpful information about hotel services, room booking, amenities, and general assistance.`,
          messages: [
            {
              role: 'user',
              content: TranscriptionText,
            },
          ],
        });

        const aiResponse = completion.content[0]?.type === 'text' 
          ? completion.content[0].text 
          : 'I apologize, but I could not process your request at this time.';

        // Create TwiML response with AI-generated text
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say(
          {
            voice: 'alice',
            language: 'en-US',
          },
          aiResponse
        );

        // Allow for another recording after AI response
        twiml.record({
          transcribe: true,
          transcribeCallback: '/api/twilio/transcription',
          maxLength: 30,
          finishOnKey: '#',
        });

        res.type('text/xml');
        res.send(twiml.toString());
        
        console.log('✅ Claude AI response sent via voice:', aiResponse);
      } catch (error) {
        console.error('❌ Claude AI error in voice call:', error);
        
        // Fallback response if Claude fails
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say(
          {
            voice: 'alice',
            language: 'en-US',
          },
          'Thank you for your message. Our team will assist you shortly. Please hold on.'
        );
        
        res.type('text/xml');
        res.send(twiml.toString());
      }
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.sendStatus(500);
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