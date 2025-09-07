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

# Populate database with demo data (optional)
npm run prisma:seed

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

# Seed database with demo data
npm run prisma:seed
# or alternatively:
npx prisma db seed
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

### Demo Data (Seeding)
The project includes comprehensive demo data for testing and development:

**What's included in seed data:**
- **6 Brands**: Apple, Samsung, Nike, Adidas, Sony, Legacy Brand
- **5 Stores**: Various stores with different statuses (Active, Suspended)
- **Multiple Users**: Admin, Store Admin, Store Staff, Sales with proper roles
- **10+ Store-Brand Entitlements**: With different pricing modes and time-based access
- **5 Store Product Permissions**: Different permission levels per store
- **14+ Products**: Realistic product catalog across all brands and categories
- **20+ Stock Records**: Diverse inventory data with pricing and quantities

**Default Login Credentials after seeding:**
- **Admin**: admin@interlink.local / admin123
- **Store Admin**: admin@bangkokelectronics.com / admin123
- **Store Staff**: staff@sportzone.co.th / admin123

**Command to populate data:**
```bash
npm run prisma:seed
```

This creates a complete testing environment for all Phase 3 APIs (95 test cases ready).

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

### 🆕 Phase 3 APIs (Business Logic)

#### 🏷️ Brand Management APIs
- `GET /api/brands` - Get all brands
- `POST /api/brands` - Create brand (Admin only)
- `GET /api/brands/:id` - Get brand by ID
- `PATCH /api/brands/:id` - Update brand (Admin only)
- `DELETE /api/brands/:id` - Delete brand (Admin only)
- `GET /api/brands/slug/:slug` - Get brand by slug
- `GET /api/brands/:id/stats` - Get brand statistics (Admin only)

#### 🏪 Store Management APIs  
- `GET /api/stores` - Get all stores (Admin only)
- `POST /api/stores` - Create store (Admin only)
- `GET /api/stores/:id` - Get store by ID
- `PATCH /api/stores/:id` - Update store (Admin/Store Admin)
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/slug/:slug` - Get store by slug
- `GET /api/stores/:id/stats` - Get store statistics
- `GET /api/stores/:id/brands` - Get store's brand entitlements
- `GET /api/stores/active` - Get active stores only

#### 📦 Product Management APIs
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin/Store Admin)
- `GET /api/products/:id` - Get product by ID with details
- `PATCH /api/products/:id` - Update product (Admin/Store Admin)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/sku/:sku` - Get product by SKU
- `GET /api/products/search` - Search products with filters
- `GET /api/products/:id/stats` - Get product statistics
- `GET /api/products/brand/:brandId` - Get products by brand
- `GET /api/products/store/:storeId` - Get products by store

#### 🔗 Store-Brand Entitlement APIs
- `GET /api/entitlements` - Get all entitlements (Admin only)
- `POST /api/entitlements` - Create entitlement (Admin only)
- `GET /api/entitlements/:id` - Get entitlement by ID
- `PATCH /api/entitlements/:id` - Update entitlement (Admin only)
- `DELETE /api/entitlements/:id` - Delete entitlement (Admin only)
- `PATCH /api/entitlements/:id/revoke` - Revoke entitlement (Admin only)
- `GET /api/entitlements/store/:storeId` - Get store's entitlements
- `GET /api/entitlements/brand/:brandId` - Get brand's entitlements (Admin only)
- `GET /api/entitlements/check/:storeId/:brandId` - Check access permission
- `GET /api/entitlements/stats` - Get entitlement statistics (Admin only)
- `GET /api/entitlements/active` - Get active entitlements only

### Legacy Admin APIs
- `/api/admin/brands` - Legacy brand management
- `/api/admin/stores` - Legacy store management
- `/api/admin/users` - User management
- `/api/admin/stores/{storeId}/product-permissions` - 🆕 Store product permissions
- `/api/admin/product-approvals` - 🆕 Product approval queue

### Public APIs
- `/api/public/stores/{slug}` - Public store info
- `/api/public/orders` - Place orders (guest)

## 🧪 Testing

### Automated Tests
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

### Manual API Testing
The project includes comprehensive manual testing suite with **95 test cases**:

**Location**: `TESTING/` folder
- **Brand Management**: 10 test cases (`06_Brand_Management/`)
- **Store Management**: 12 test cases (`07_Store_Management/`)
- **Product Management**: 15 test cases (`08_Product_Management/`)
- **Store-Brand Entitlements**: 12 test cases (`09_Store_Brand_Entitlements/`)
- **Core APIs**: 46 existing test cases (Authentication, Authorization, etc.)

**Prerequisites for testing:**
1. Backend server running (`npm run start:dev`)
2. Database seeded with demo data (`npm run prisma:seed`)
3. Services available:
   - API Server: http://localhost:3001
   - Swagger UI: http://localhost:3001/api/docs
   - Prisma Studio: http://localhost:5555

**Testing Tools:**
- cURL commands (provided in test files)
- Swagger UI (interactive testing)
- Postman/Insomnia (import from Swagger)

See `TESTING/README.md` for detailed testing instructions.

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

## 📈 Development Progress

### ✅ Phase 1 Complete - Backend Core Setup 
- NestJS application structure
- PostgreSQL database with Prisma ORM
- Docker development environment
- Basic health check endpoints
- Code quality tools (ESLint, Prettier)

### ✅ Phase 2 Complete - Authentication & Authorization APIs
- JWT-based authentication system
- Role-Based Access Control (RBAC)
- User management with multiple roles
- Secure login/logout functionality
- Password hashing and validation

### ✅ Phase 3 Complete - Business Logic APIs
- **🏷️ Brand Management**: Complete CRUD operations with statistics
- **🏪 Store Management**: Full store lifecycle with subscription handling
- **📦 Product Management**: Advanced product catalog with search/filtering
- **🔗 Store-Brand Entitlements**: Time-based access control system
- **📊 Comprehensive Demo Data**: 6 brands, 5 stores, 14+ products, 20+ stock records
- **🧪 Testing Suite**: 95 manual test cases covering all APIs
- **📚 Complete API Documentation**: Swagger UI with all endpoints documented

### 🚀 Next: Phase 4 - Advanced Features
- Stock Management APIs
- Order Processing APIs  
- Payment Integration
- Background Jobs & Notifications
- File Upload APIs
- Performance Optimization

**Current Status**: **Phase 3 Complete** - All business logic APIs implemented and tested ✅