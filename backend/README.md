# Kiyaku Smart Frontdesk Backend

Backend API for the Kiyaku Smart Hotel management system built with Node.js, Express, TypeScript, and Prisma.

## Features

- **Authentication**: JWT-based user authentication
- **Reservation Management**: Complete CRUD operations for hotel reservations
- **Hotel Management**: Hotel information and settings
- **Chat System**: AI-powered chat using Claude API
- **Phone Integration**: Twilio integration for voice calls
- **Q&A Management**: Knowledge base for hotel information
- **Database**: MySQL with Prisma ORM

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT
- **AI**: Claude API for chat responses
- **Phone**: Twilio for voice calls
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Required environment variables:
```env
DATABASE_URL="mysql://username:password@localhost:3306/kiyaku_hotel"
JWT_SECRET=your-super-secret-jwt-key-here
CLAUDE_API_KEY=your-claude-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Reservations
- `GET /api/reservations` - List reservations with pagination and filters
- `GET /api/reservations/:id` - Get reservation details
- `POST /api/reservations` - Create new reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

### Hotels
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/:id` - Get hotel details
- `PUT /api/hotels/:id` - Update hotel information

### Chat
- `POST /api/chat/message` - Send chat message and get AI response
- `GET /api/chat/history/:sessionId` - Get chat history

### Twilio
- `POST /api/twilio/call` - Initiate phone call
- `GET /api/twilio/calls` - Get call history
- `POST /api/twilio/voice` - Voice response webhook
- `POST /api/twilio/transcription` - Transcription callback

### Q&A
- `GET /api/qa` - List Q&A items with filters
- `POST /api/qa` - Create Q&A item
- `PUT /api/qa/:id` - Update Q&A item
- `DELETE /api/qa/:id` - Delete Q&A item

## Database Schema

The database includes the following main entities:

- **Users**: Authentication and user management
- **Hotels**: Hotel information and settings
- **Reservations**: Booking management
- **QAItems**: Knowledge base for chat responses
- **ChatHistory**: Chat conversation logs
- **TwilioCalls**: Phone call records

## Development

### Building for Production

```bash
npm run build
npm start
```

### Running Tests

```bash
npm test
```

## Deployment

1. Set up MySQL database
2. Configure environment variables
3. Run database migrations
4. Build and start the application

The backend provides a complete REST API for the hotel management system with real-time chat capabilities and phone integration.