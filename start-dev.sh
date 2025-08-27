#!/bin/bash

echo "🚀 Starting SkanOS Development Environment..."

# Start database services
echo "📦 Starting PostgreSQL and Redis..."
docker compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Generate Prisma client
echo "🔨 Generating Prisma client..."
cd packages/db
npm run db:generate

# Run database migrations (if needed)
echo "📊 Running database migrations..."
npx prisma migrate deploy || npx prisma db push

cd ../..

echo "✅ Services ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/api/docs"
echo ""
echo "👤 Login with:"
echo "   Email: skander@skanos.dev"  
echo "   Password: SkanOS2024!"
echo ""
echo "🏃 Starting development servers..."
echo "   Use 'npm run dev' to start both frontend and backend"