import express from 'express';
import { prisma } from '../lib/prisma.js';
import { body, validationResult } from 'express-validator';

export const reservationRoutes = express.Router();

reservationRoutes.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { guestName: { contains: search as string } },
        { guestEmail: { contains: search as string } },
        { guestPhone: { contains: search as string } },
      ];
    }

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          hotel: {
            select: { name: true, address: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.reservation.count({ where }),
    ]);

    res.json({
      success: true,
      data: reservations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

reservationRoutes.get('/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: {
        hotel: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservation',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

reservationRoutes.post(
  '/',
  [
    body('hotelId').notEmpty().withMessage('Hotel ID is required'),
    body('guestName').notEmpty().withMessage('Guest name is required'),
    body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
    body('roomType').notEmpty().withMessage('Room type is required'),
    body('guests').isInt({ min: 1 }).withMessage('At least 1 guest is required'),
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

      const reservation = await prisma.reservation.create({
        data: {
          ...req.body,
          checkIn: new Date(req.body.checkIn),
          checkOut: new Date(req.body.checkOut),
        },
        include: {
          hotel: true,
        },
      });

      res.status(201).json({
        success: true,
        data: reservation,
        message: 'Reservation created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create reservation',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

reservationRoutes.put('/:id', async (req, res) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        ...(req.body.checkIn && { checkIn: new Date(req.body.checkIn) }),
        ...(req.body.checkOut && { checkOut: new Date(req.body.checkOut) }),
        updatedAt: new Date(),
      },
      include: {
        hotel: true,
      },
    });

    res.json({
      success: true,
      data: reservation,
      message: 'Reservation updated successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update reservation',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

reservationRoutes.delete('/:id', async (req, res) => {
  try {
    await prisma.reservation.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Reservation deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete reservation',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});