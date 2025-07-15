import express from 'express';
import { prisma } from '../lib/prisma.js';

export const chatRoutes = express.Router();

// 使用动态导入确保安全加载
let anthropic: any = null;

if (process.env.CLAUDE_API_KEY) {
  try {
    const Anthropic = await import('@anthropic-ai/sdk');
    anthropic = new Anthropic.default({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    console.log('✅ Claude API initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Claude API:', error);
  }
}

chatRoutes.post('/message', async (req, res) => {
  try {
    const { message, sessionId, userId, hotelId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Message and session ID are required',
      });
    }

    let context = '';
    if (hotelId) {
      const [hotel, qaItems] = await Promise.all([
        prisma.hotel.findUnique({ where: { id: hotelId } }),
        prisma.qAItem.findMany({
          where: { hotelId, isActive: true },
          orderBy: { priority: 'desc' },
        }),
      ]);

      if (hotel && qaItems.length > 0) {
        context = `Hotel: ${hotel.name}
Address: ${hotel.address}
Available Q&A:
${qaItems.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}`;
      }
    }

    let response: string;
    
    if (anthropic) {
      try {
        const completion = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          temperature: 0.7,
          system: `You are a helpful hotel assistant for Kiyaku Smart Hotel. Use the following context to answer questions about the hotel:\n\n${context}\n\nPlease respond naturally and helpfully. If asked in Japanese, respond in Japanese. If asked in English, respond in English.`,
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        });
        
        response = completion.content[0]?.type === 'text' 
          ? completion.content[0].text 
          : 'I apologize, but I could not generate a response at this time.';
      } catch (error) {
        console.error('Claude API error:', error);
        response = `Thank you for your message: "${message}". I'm a helpful hotel assistant, but AI chat is temporarily unavailable. Please contact our staff for assistance.`;
      }
    } else {
      response = `Thank you for your message: "${message}". I'm a helpful hotel assistant for Kiyaku Smart Hotel. Our AI chat service is currently being set up. Please contact our staff for immediate assistance.`;
    }

    await prisma.chatHistory.create({
      data: {
        userId,
        sessionId,
        message,
        response,
        type: 'TEXT',
        metadata: {
          hotelId,
          timestamp: new Date().toISOString(),
        },
      },
    });

    res.json({
      success: true,
      data: {
        response,
        sessionId,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

chatRoutes.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const history = await prisma.chatHistory.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: Number(limit),
    });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});