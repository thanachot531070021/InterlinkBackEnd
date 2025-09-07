# Interlink Backend API

🔧 Backend API Server for Interlink B2B System

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- npm or yarn

### Development Setup

1. **Clone and install dependencies**
```bash
cd interlink-backend
npm install
```

2. **Start development environment**
```bash
# Start PostgreSQL, Redis, and MailHog
docker-compose up -d db redis mailhog

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run start:dev
```

3. **Access services**
- API Server: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs
- Database UI (Adminer): http://localhost:8080
- Email Testing (MailHog): http://localhost:8025

## 📊 Database

### Prisma Commands
```bash
# Generate Prisma client
npm run prisma:generate

# Create and run migration
npm run prisma:migrate

# Push schema to database (dev only)
npm run prisma:push

# Open Prisma Studio
npm run prisma:studio

# Reset database
npx prisma migrate reset
```

### Database Schema
- **Users & Auth**: User management with RBAC
- **Stores**: Store management with subscriptions
- **Brands**: Brand management
- **Products**: Product catalog with variants
- **🆕 Store Product Permissions**: Store product creation permissions
- **🆕 Product Approval Queue**: Product approval workflow
- **Stock**: Inventory management with reservations
- **Orders**: Order processing with TTL-based reservations
- **Payments**: Payment processing
- **Audit**: Event logging

## 🔐 Authentication

### JWT Strategy
- Access tokens: 15 minutes
- Refresh tokens: 7 days
- Role-based access control (RBAC)

### User Roles
- `ADMIN`: Super admin
- `STORE_ADMIN`: Store owner
- `STORE_STAFF`: Store employee
- `SALE`: Sales agent (future)
- `CUSTOMER_GUEST`: Guest customer

## 📡 API Endpoints

### Core APIs
- `POST /api/auth/login` - Login
- `POST /api/auth/otp/request` - Request OTP
- `POST /api/auth/otp/verify` - Verify OTP
- `GET /api/health` - Health check

### Admin APIs
- `/api/admin/brands` - Brand management
- `/api/admin/stores` - Store management
- `/api/admin/users` - User management
- `/api/admin/stores/{storeId}/product-permissions` - 🆕 Store product permissions
- `/api/admin/product-approvals` - 🆕 Product approval queue

### Store APIs
- `/api/store/profile` - Store profile
- `/api/store/products` - Product management
- `/api/store/products/create` - 🆕 Create store products
- `/api/store/stock` - Stock management
- `/api/store/orders` - Order management

### Public APIs
- `/api/public/stores/{slug}` - Public store info
- `/api/public/orders` - Place orders (guest)

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 🐳 Docker

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production Build
```bash
# Build production image
docker build -t interlink-backend .

# Run production container
docker run -p 3001:3001 interlink-backend
```

## 📝 Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh secret

### Optional
- `SMTP_*` - Email configuration
- `S3_*` - File storage configuration
- `GOOGLE_CLIENT_*` - OAuth configuration

## 🆕 New Features

### Store Product Creation
- Stores can create their own products (with permissions)
- Admin approval workflow
- Monthly quotas and category restrictions
- Pricing rule validation

### Key Tables
- `store_product_permissions` - Permission management
- `product_approval_queue` - Approval workflow
- `products.created_by_store_id` - Track store-created products

## 📈 Monitoring

### Health Checks
- `GET /api/health` - Application health
- Database connectivity check
- External service checks

### Logging
- Structured JSON logs with Winston
- Request/response logging
- Error tracking integration ready

## 🚢 Deployment

### Environment Setup
1. Set production environment variables
2. Configure database connection
3. Set up file storage (S3-compatible)
4. Configure email service (SMTP)

### Database Migration
```bash
# Production migration
npx prisma migrate deploy

# Generate client
npx prisma generate
```

### Production Start
```bash
# Build application
npm run build

# Start production server
npm run start:prod
```

## 📚 Documentation

- API Documentation: `/api/docs` (Swagger)
- Database Schema: `prisma/schema.prisma`
- Backend Architecture: `../BACKEND.md`
- Development Checklist: `../checkList.md`

## 🤝 Development Workflow

1. Create feature branch
2. Implement changes
3. Write/update tests
4. Update documentation
5. Submit pull request
6. Code review
7. Merge to main

---

**Status**: Phase 1 Complete - Backend Core Setup ✅
**Next**: Phase 2 - Authentication & Authorization APIs