import express from 'express';
import { prisma } from '../lib/prisma.js';

export const chatRoutes = express.Router();

// 暂时注释掉 Anthropic 导入，确保路由先工作
// import Anthropic from '@anthropic-ai/sdk';
// const anthropic = process.env.CLAUDE_API_KEY ? new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
// }) : null;

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

    // 暂时使用固定回复测试路由
    const response = `Thank you for your message: "${message}". I'm a helpful hotel assistant for Kiyaku Smart Hotel. 
    
Our hotel features:
- Free WiFi throughout the hotel
- 24/7 concierge service  
- Fitness center and spa
- Restaurant and room service
- Convenient location in Shibuya, Tokyo

How can I further assist you today?`;

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