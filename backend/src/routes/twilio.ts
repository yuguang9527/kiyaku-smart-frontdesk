import express from 'express';
import twilio from 'twilio';
import { prisma } from '../lib/prisma.js';

export const twilioRoutes = express.Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

twilioRoutes.post('/call', async (req, res) => {
  try {
    const { to, from } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
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
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

twilioRoutes.post('/transcription', async (req, res) => {
  try {
    const { CallSid, TranscriptionText } = req.body;

    if (CallSid && TranscriptionText) {
      await prisma.twilioCall.update({
        where: { callSid: CallSid },
        data: {
          transcript: TranscriptionText,
          status: 'COMPLETED',
        },
      });
    }

    res.sendStatus(200);
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