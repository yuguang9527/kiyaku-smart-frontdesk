import express from 'express';
import { prisma } from '../lib/prisma.js';

export const hotelRoutes = express.Router();

hotelRoutes.get('/', async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotels',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

hotelRoutes.get('/:id', async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: {
            reservations: true,
            qaItems: true,
          },
        },
      },
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotel',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

hotelRoutes.put('/:id', async (req, res) => {
  try {
    const hotel = await prisma.hotel.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: hotel,
      message: 'Hotel updated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update hotel',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});