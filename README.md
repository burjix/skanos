# SkanOS - Personal Operating System

A comprehensive digital brain and life optimization system built with modern technologies.

## Architecture

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: NestJS, TypeScript, PostgreSQL + pgvector, Redis, BullMQ  
- **AI**: OpenAI GPT-4 integration ready
- **Database**: PostgreSQL with vector extensions for semantic search
- **Caching**: Redis for sessions and queue management
- **Monorepo**: Turborepo for efficient development

## Features

- 🔐 **Authentication**: Email/password + Google Authenticator OTP
- 📊 **Today Dashboard**: Beautiful overview of daily activity
- ⚡ **Quick Capture**: Instant thought and idea capturing
- 🧠 **Knowledge Graph**: Entities and relationships tracking
- 🔍 **Vector Search**: Semantic search through memories
- 📈 **Life Pillars**: Health, Wealth, Spirituality tracking
- 🎯 **Event Streaming**: Everything is an event architecture
- 💡 **AI Insights**: Pattern recognition and recommendations

## Quick Start

### 1. Start Dependencies

```bash
# Start PostgreSQL and Redis
docker compose -f docker-compose.dev.yml up -d
```

### 2. Setup Database

```bash
# Generate Prisma client
cd packages/db
npm run db:generate

# Run migrations
npm run db:migrate
```

### 3. Start Development Servers

```bash
# Start all services
npm run dev

# Or start individually:
# Backend (port 8000)
cd apps/api && npm run dev

# Frontend (port 3000) 
cd apps/web && npm run dev
```

## Default Login

- **Email**: `skander@skanos.dev`
- **Password**: `SkanOS2024!`
- **OTP**: Optional (can be set up after login)

## Project Structure

```
/home/claude/projects/skanos/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend
├── packages/
│   ├── shared/       # Shared types & utilities
│   ├── ui/           # Component library
│   └── db/           # Database schemas
├── turbo.json        # Turborepo configuration
└── docker-compose.dev.yml
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL="postgresql://skanos:skanos123@localhost:5432/skanos_db"
JWT_SECRET="your-jwt-secret"
REDIS_HOST="localhost"
REDIS_PORT="6379"
OPENAI_API_KEY="your-openai-api-key"
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Core Concepts

### Events
Everything in SkanOS is an event - thoughts, observations, goals, achievements. Events flow through the system and generate insights.

### Entities
People, places, concepts, and goals that are extracted from events and form your knowledge graph.

### Memories
Long-term storage with vector embeddings for semantic retrieval and AI-powered insights.

### Pillars
Core life areas (Health, Wealth, Spirituality) that organize your activities and progress.

## Development

The system is built for rapid development and deployment:

- Hot reloading on both frontend and backend
- Type-safe API contracts with shared schemas  
- Automated AI processing queues
- Real-time updates and beautiful animations
- Production-ready authentication and security

Built with ❤️ for personal optimization and digital self-mastery.