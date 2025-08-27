# SkanOS - Project Context

## Project Overview
**SkanOS** is Skander's personal operating system - a single-user digital brain and life companion that transforms daily intentions into measurable outcomes through AI-powered intelligence.

## Project Details
- **Status**: 🚀 Active Development - Core features completed TODAY
- **Type**: Personal Operating System / Digital Brain
- **User**: Single hardcoded user (Skander)
- **Repository**: https://github.com/burjix/skanos
- **Local Path**: `/home/claude/projects/skanos/`
- **Started**: 2025-08-27
- **Target Deployment**: TODAY

## Technical Architecture

### Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind, MagicUI, Shadcn/ui, Framer Motion
- **Backend**: NestJS, TypeScript, PostgreSQL + pgvector, Redis, BullMQ
- **Database**: PostgreSQL with vector extensions for semantic search
- **AI**: OpenAI GPT-4 integration ready
- **Infrastructure**: Self-hosted VPS with PM2, Nginx, SSL

### Key Features Implemented
- ✅ **Authentication**: Email/password + Google Authenticator OTP
- ✅ **Event Streaming**: Everything-is-an-event architecture
- ✅ **Knowledge Graph**: Entities, relationships, temporal connections
- ✅ **Vector Search**: Semantic search with pgvector embeddings
- ✅ **Today Dashboard**: Beautiful dark theme with premium glass effects
- ✅ **Quick Capture**: Instant thought capturing with keyboard shortcuts
- ✅ **Life Pillars**: Health, Wealth, Spirituality tracking
- ✅ **AI Foundation**: Ready for GPT-4 integration and insights

## Project Structure
```
/home/claude/projects/skanos/
├── apps/
│   ├── api/          # NestJS backend with full API
│   └── web/          # Next.js 15 frontend with MagicUI
├── packages/
│   ├── shared/       # Shared types and schemas (Zod validation)
│   ├── ui/           # Component library foundation
│   └── db/           # Prisma database schemas with pgvector
├── turbo.json        # Turborepo configuration
└── docker-compose.dev.yml # Local development setup
```

## Core Design Principles
- **Single User Focus**: No multi-tenancy complexity, pure performance
- **Premium Aesthetics**: Dark theme, glass morphism, NO generic AI look
- **Speed First**: Sub-200ms API responses, instant UI feedback
- **Privacy & Control**: Self-hosted, encrypted, user owns everything
- **Event-Driven**: Every interaction captured and processed
- **AI-Powered**: Semantic search, pattern recognition, automated insights

## Authentication Details
- **Primary User**: `skander@skanos.dev`
- **Password**: `SkanOS2024!` (hardcoded hash in env)
- **2FA**: Google Authenticator OTP support
- **Sessions**: JWT-based with secure token management

## Database Schema Highlights
- **Events**: Universal event stream for all user activity
- **Entities**: People, places, ideas, projects with vector embeddings
- **Relationships**: Dynamic graph connections between entities
- **Memories**: Long-term storage with semantic search
- **Life Pillars**: Health, wealth, spirituality progress tracking

## Development Status

### Completed Today ✅
1. **Foundation**: Complete monorepo setup with Turborepo
2. **Backend**: Full NestJS API with authentication, events, entities
3. **Frontend**: Beautiful Next.js 15 app with dark theme
4. **Database**: PostgreSQL with pgvector, all core schemas
5. **Authentication**: Secure login with OTP support
6. **UI Components**: Premium dark theme with glass effects
7. **Event System**: Everything-is-an-event architecture
8. **Knowledge Graph**: Entity extraction and relationships

### Next Steps (Immediate)
- [ ] **Create GitHub repository**: Push initial codebase
- [ ] **Deploy to production**: PM2 + Nginx setup on VPS
- [ ] **Environment setup**: Production env vars and SSL
- [ ] **Testing**: Validate all core functionality works
- [ ] **AI Integration**: Connect OpenAI API for intelligence
- [ ] **Data seeding**: Initialize with sample data

### Future Enhancements (Phase 2)
- [ ] **Advanced AI**: Proactive insights and pattern recognition
- [ ] **Trading Copilot**: Risk management and journal
- [ ] **Content Creation**: Pipeline for social media
- [ ] **Mobile PWA**: Optimized mobile experience
- [ ] **Automation**: Smart nudges and recommendations

## Production Deployment Plan

### Infrastructure
- **Domain**: Will need subdomain (e.g., brain.g8nie.com)
- **SSL**: Let's Encrypt certificate
- **Process Management**: PM2 cluster mode
- **Reverse Proxy**: Nginx configuration
- **Database**: PostgreSQL with pgvector extension
- **Caching**: Redis for sessions and queues

### Environment Variables
```bash
# Backend
DATABASE_URL="postgresql://skanos:skanos123@localhost:5432/skanos_db"
JWT_SECRET="production-jwt-secret"
REDIS_HOST="localhost"
REDIS_PORT="6379"
OPENAI_API_KEY="sk-..."
HARDCODED_EMAIL="skander@skanos.dev"
HARDCODED_PASSWORD_HASH="$argon2id$..."

# Frontend
NEXT_PUBLIC_API_URL="https://brain.g8nie.com/api"
```

## Performance Targets
- **API Response Time**: < 200ms for simple queries
- **AI Operations**: < 3s for complex processing
- **Frontend Load**: < 2s initial page load
- **Real-time Updates**: < 100ms latency
- **Database Queries**: Optimized with proper indexing

## Security Features
- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: Protection against abuse
- **HTTPS Enforcement**: All traffic encrypted
- **Session Security**: Secure JWT implementation
- **Data Encryption**: Sensitive data encrypted at rest
- **CORS Configuration**: Proper origin restrictions

## Key Differentiators
1. **True Personal OS**: Built for one user, maximum performance
2. **Event-Driven Architecture**: Everything connects and builds memory
3. **Premium Design**: Beautiful, not generic AI interface
4. **Self-Hosted Privacy**: Complete data ownership
5. **AI-First**: Intelligence baked into every feature
6. **Life Integration**: All pillars connected in one system

## Success Metrics
- **Daily Usage**: Multiple interactions per day
- **Event Capture**: Consistent logging of activities
- **Knowledge Growth**: Expanding entity graph
- **Pattern Recognition**: AI insights becoming more accurate
- **Life Optimization**: Measurable improvements in tracked pillars

## Technical Debt & Notes
- **MagicUI Integration**: Need to fully implement premium animations
- **Error Handling**: Comprehensive error boundaries needed
- **Testing**: Unit and integration tests to be added
- **Documentation**: API docs with Swagger complete
- **Monitoring**: Production logging and metrics setup

## Context Updates Log
- **2025-08-27 Session 1**: Project created, full implementation completed in single day
- **Architecture Decision**: Chose NestJS over Express for better structure
- **UI Decision**: MagicUI + Shadcn for premium feel without generic AI look
- **Database Decision**: PostgreSQL + pgvector for semantic search capabilities

---

**Next Session Should Focus On**: Deployment to production, GitHub setup, and initial testing with real data.

*Last Updated: 2025-08-27*  
*Status: Core implementation complete, ready for deployment*