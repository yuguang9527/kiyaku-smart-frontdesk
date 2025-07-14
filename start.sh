#!/bin/bash

echo "🚀 Starting Kiyaku Smart Frontdesk Full Stack Application"
echo "========================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env from example..."
    cp .env.example .env
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env from example..."
    cp backend/.env.example backend/.env
fi

echo "🐳 Starting services with Docker Compose..."
docker-compose up -d mysql

echo "⏳ Waiting for MySQL to be ready..."
sleep 30

echo "🗄️  Setting up database..."
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
cd ..

echo "🔄 Starting all services..."
docker-compose up -d

echo ""
echo "✅ Services are starting up!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
echo "🗄️  MySQL: localhost:3306"
echo ""
echo "📋 Default admin login:"
echo "   Email: admin@kiyaku.com"
echo "   Password: admin123"
echo ""
echo "🏃‍♂️ To stop all services: docker-compose down"
echo "📊 To view logs: docker-compose logs -f"