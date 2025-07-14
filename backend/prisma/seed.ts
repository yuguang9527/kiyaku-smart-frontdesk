import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kiyaku.com' },
    update: {},
    create: {
      email: 'admin@kiyaku.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const hotel = await prisma.hotel.upsert({
    where: { id: 'kiyaku-hotel-1' },
    update: {},
    create: {
      id: 'kiyaku-hotel-1',
      name: 'Kiyaku Smart Hotel',
      address: '123 Tokyo Street, Shibuya, Tokyo, Japan',
      phone: '+81-3-1234-5678',
      email: 'info@kiyaku.com',
      description: 'A modern smart hotel with AI-powered customer service',
      amenities: {
        wifi: true,
        parking: true,
        gym: true,
        spa: false,
        restaurant: true,
        roomService: true,
        concierge: true,
        airConditioning: true,
      },
      settings: {
        checkInTime: '15:00',
        checkOutTime: '11:00',
        currency: 'JPY',
        timezone: 'Asia/Tokyo',
      },
    },
  });

  const sampleReservations = [
    {
      id: 'reservation-1',
      hotelId: hotel.id,
      guestName: 'John Smith',
      guestEmail: 'john@example.com',
      guestPhone: '+1-555-0123',
      checkIn: new Date('2024-12-20'),
      checkOut: new Date('2024-12-23'),
      roomType: 'Deluxe Room',
      guests: 2,
      totalAmount: 45000,
      status: 'CONFIRMED' as const,
    },
    {
      id: 'reservation-2',
      hotelId: hotel.id,
      guestName: 'Emma Johnson',
      guestEmail: 'emma@example.com',
      guestPhone: '+1-555-0456',
      checkIn: new Date('2024-12-22'),
      checkOut: new Date('2024-12-25'),
      roomType: 'Suite',
      guests: 1,
      totalAmount: 80000,
      status: 'PENDING' as const,
    },
  ];

  for (const reservation of sampleReservations) {
    await prisma.reservation.upsert({
      where: { id: reservation.id },
      update: {},
      create: reservation,
    });
  }

  const sampleQA = [
    {
      id: 'qa-1',
      hotelId: hotel.id,
      question: 'What time is check-in?',
      answer: 'Check-in time is 3:00 PM (15:00). Early check-in may be available upon request.',
      category: 'Check-in/Check-out',
      language: 'en',
    },
    {
      id: 'qa-2',
      hotelId: hotel.id,
      question: 'Do you have WiFi?',
      answer: 'Yes, we provide complimentary high-speed WiFi throughout the hotel.',
      category: 'Amenities',
      language: 'en',
    },
    {
      id: 'qa-3',
      hotelId: hotel.id,
      question: 'チェックイン時間は何時ですか？',
      answer: 'チェックイン時間は午後3時（15:00）です。アーリーチェックインについてはリクエストに応じて対応可能です。',
      category: 'Check-in/Check-out',
      language: 'ja',
    },
  ];

  for (const qa of sampleQA) {
    await prisma.qAItem.upsert({
      where: { id: qa.id },
      update: {},
      create: qa,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: ${adminUser.email}`);
  console.log(`🏨 Hotel: ${hotel.name}`);
  console.log(`📅 Reservations: ${sampleReservations.length}`);
  console.log(`❓ Q&A items: ${sampleQA.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });