import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { authRoutes } from './routes/auth.js';
import { reservationRoutes } from './routes/reservations.js';
import { hotelRoutes } from './routes/hotels.js';
import { chatRoutes } from './routes/chat.js';
import { twilioRoutes } from './routes/twilio.js';
import { qaRoutes } from './routes/qa.js';
import { testClaudeRoutes } from './routes/test-claude.js';

// Debug: Log imported routes
console.log('🔍 Debug: Routes imported:', {
  authRoutes: !!authRoutes,
  reservationRoutes: !!reservationRoutes,
  hotelRoutes: !!hotelRoutes,
  chatRoutes: !!chatRoutes,
  twilioRoutes: !!twilioRoutes,
  qaRoutes: !!qaRoutes,
});
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://kiyaku-smart-frontdesk.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/twilio', twilioRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/test-claude', testClaudeRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;