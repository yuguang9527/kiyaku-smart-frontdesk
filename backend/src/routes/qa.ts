import express from 'express';
import { prisma } from '../lib/prisma.js';
import { body, validationResult } from 'express-validator';

export const qaRoutes = express.Router();

qaRoutes.get('/', async (req, res) => {
  try {
    const { hotelId, language, category, search } = req.query;

    const where: any = {};
    if (hotelId) where.hotelId = hotelId as string;
    if (language) where.language = language as string;
    if (category) where.category = category as string;
    if (search) {
      where.OR = [
        { question: { contains: search as string } },
        { answer: { contains: search as string } },
      ];
    }

    const qaItems = await prisma.qAItem.findMany({
      where,
      include: {
        hotel: {
          select: { name: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: qaItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Q&A items',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

qaRoutes.post(
  '/',
  [
    body('hotelId').notEmpty().withMessage('Hotel ID is required'),
    body('question').notEmpty().withMessage('Question is required'),
    body('answer').notEmpty().withMessage('Answer is required'),
    body('language').optional().isIn(['en', 'ja', 'zh', 'ko']).withMessage('Invalid language'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const qaItem = await prisma.qAItem.create({
        data: req.body,
        include: {
          hotel: {
            select: { name: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: qaItem,
        message: 'Q&A item created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create Q&A item',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

qaRoutes.put('/:id', async (req, res) => {
  try {
    const qaItem = await prisma.qAItem.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        updatedAt: new Date(),
      },
      include: {
        hotel: {
          select: { name: true },
        },
      },
    });

    res.json({
      success: true,
      data: qaItem,
      message: 'Q&A item updated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        success: false,
        message: 'Q&A item not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update Q&A item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

qaRoutes.delete('/:id', async (req, res) => {
  try {
    await prisma.qAItem.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Q&A item deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({
        success: false,
        message: 'Q&A item not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete Q&A item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});