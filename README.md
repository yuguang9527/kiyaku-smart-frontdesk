# Kiyaku Smart Frontdesk

A modern, full-stack hotel management system with AI-powered customer service and phone integration.

## 🚀 Features

- **Smart Chat System**: AI-powered customer service using Claude
- **Phone Integration**: Voice calls and transcription via Twilio  
- **Reservation Management**: Complete booking system
- **Multi-language Support**: Japanese and English
- **Admin Dashboard**: Hotel management interface
- **Real-time Communication**: Chat and voice support
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **State Management**: React hooks + Context
- **Routing**: React Router

### Backend  
- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database**: MySQL + Prisma ORM
- **Authentication**: JWT
- **AI**: Claude API for chat responses
- **Phone**: Twilio for voice calls
- **Security**: Helmet, CORS, Rate limiting

### Infrastructure
- **Database**: MySQL 8.0
- **Containerization**: Docker + Docker Compose
- **Development**: Hot reload for both frontend and backend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yuguang9527/kiyaku-smart-frontdesk.git
cd kiyaku-smart-frontdesk
```

### 2. Environment Setup
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
```

Update the environment files with your API keys:
- Claude API key for AI chat
- Twilio credentials for phone integration

### 3. Start the Application
```bash
# Make start script executable and run
chmod +x start.sh
./start.sh
```

This will:
- Start MySQL database
- Set up database schema and seed data  
- Start backend API server
- Start frontend development server

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001  
- **Database**: localhost:3306

### Default Admin Login
- **Email**: admin@kiyaku.com
- **Password**: admin123

## 📁 Project Structure

```
kiyaku-smart-frontdesk/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── hooks/                   # Custom hooks
│   └── types/                   # TypeScript types
├── backend/                     # Backend source code
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic
│   │   └── lib/                # Utilities
│   ├── prisma/                 # Database schema and migrations
│   └── README.md               # Backend documentation
├── docker-compose.yml          # Multi-container setup
└── start.sh                    # Quick start script
```

## 🔧 Development

### Frontend Development
```bash
npm install
npm run dev
```

### Backend Development  
```bash
cd backend
npm install
npm run dev
```

### Database Operations
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Reset database
npx prisma migrate reset
```

## 📚 API Documentation

The backend provides REST APIs for:

- **Authentication**: Login/Register
- **Reservations**: CRUD operations
- **Hotels**: Management interface
- **Chat**: AI-powered conversations
- **Twilio**: Phone call integration
- **Q&A**: Knowledge base management

See `backend/README.md` for detailed API documentation.

## 🐳 Docker Usage

### Start all services
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop all services
```bash
docker-compose down
```

### Reset everything
```bash
docker-compose down -v
./start.sh
```

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_CLAUDE_API_KEY=your-claude-api-key
```

### Backend (backend/.env)
```env
DATABASE_URL="mysql://username:password@localhost:3306/kiyaku_hotel"
JWT_SECRET=your-jwt-secret
CLAUDE_API_KEY=your-claude-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation in `backend/README.md`

---

## Original Lovable Info

**Lovable Project URL**: https://lovable.dev/projects/721a3b5c-5310-46aa-8403-092bb2ab6d42

You can also edit this project directly through [Lovable](https://lovable.dev/projects/721a3b5c-5310-46aa-8403-092bb2ab6d42) for rapid prototyping.
