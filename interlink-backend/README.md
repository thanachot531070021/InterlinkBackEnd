# 🔧 Interlink Backend API

**A Complete E-commerce B2B API System** - เชื่อมโยงแบรนด์ ร้านค้า และลูกค้าในระบบเดียว

## 📋 Project Overview

**Interlink System** เป็นระบบกลางที่เชื่อมโยงระหว่างแบรนด์สินค้า ร้านค้า และลูกค้า โดยให้ร้านค้าสามารถ:
- 🎯 **ขายสินค้าตามสิทธิ์** ที่แบรนด์กำหนด
- 📦 **จัดการสต๊อกแยกร้าน** อิสระจากกัน
- 🛒 **ประมวลผลออเดอร์** แบบ real-time พร้อมระบบจองสต๊อก
- 🛍️ **หน้าร้านออนไลน์** สำหรับลูกค้าสั่งซื้อ
- 📁 **อัพโหลดไฟล์** แบบ configurable (Local/S3)

### 🎯 Core Features
- **Multi-tenant Architecture**: แยกข้อมูลตาม store/brand อย่างปลอดภัย
- **Role-Based Access Control**: ADMIN, STORE_ADMIN, STORE_STAFF, SALE, CUSTOMER_GUEST
- **Atomic Stock Operations**: ป้องกัน race conditions ในการจัดการสต๊อก
- **TTL-based Reservations**: ระบบจองสต๊อกหมดเวลาอัตโนมัติ (60 นาที)
- **Public Storefront APIs**: E-commerce APIs สำหรับหน้าร้านลูกค้า
- **Configurable File Storage**: สลับระหว่าง Local และ S3 ได้ทันที

### 🏗️ System Architecture
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + OTP + 2FA (TOTP) + Social Login
- **File Storage**: Local/S3 Configurable
- **API Documentation**: Swagger/OpenAPI
- **Development**: Docker Compose

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

## 📊 Database Architecture

### 🗄️ Database Schema (15+ Tables)
**Core Business Tables:**
- **👤 Users & Profiles**: User management with RBAC + extended profiles
- **🏪 Stores**: Store management with subscriptions & business hours
- **🏷️ Brands**: Brand catalog management
- **📦 Products & Variants**: Product catalog with variant support
- **🔗 Store-Brand Entitlements**: Time-based access control
- **📊 Stock Management**: Multi-store inventory with reservations
- **🛒 Orders & Items**: Order processing with guest support
- **⏰ Reservations**: TTL-based stock reservations (60 min)
- **👥 Customers**: Guest customer support
- **💳 Payments**: Payment tracking
- **📁 File Uploads**: Configurable storage management
- **📋 Event Audit**: System activity logging

### 🛠️ Prisma Commands
```bash
# Generate Prisma client (required after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Push schema to database (development only)
npm run prisma:push

# Open Prisma Studio (Database UI)
npm run prisma:studio

# Reset database completely
npx prisma migrate reset

# Populate database with comprehensive demo data
npm run prisma:seed
```

### 🎯 Advanced Database Features
- **Multi-tenant Data Isolation**: Row-level security ready
- **Atomic Operations**: Transaction-safe stock management
- **Time-based Access Control**: Entitlements with effective dates
- **Audit Trail**: Complete event logging system
- **Optimized Indexes**: Performance-tuned queries

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

## 📡 Complete API Endpoints (85+ APIs)

### 🔐 Core Authentication APIs
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/profile` - Get user profile
- `GET /api/health` - System health check

### 🏷️ Brand Management APIs (7 endpoints)
- `GET /api/brands` - List all brands with pagination
- `POST /api/brands` - Create new brand (Admin only)
- `GET /api/brands/:id` - Get brand details
- `PATCH /api/brands/:id` - Update brand (Admin only)
- `DELETE /api/brands/:id` - Delete brand (Admin only)
- `GET /api/brands/slug/:slug` - Find brand by slug
- `GET /api/brands/:id/stats` - Brand statistics (Admin only)

### 🏪 Store Management APIs (8 endpoints)
- `GET /api/stores` - List all stores (Admin only)
- `POST /api/stores` - Create new store (Admin only)
- `GET /api/stores/:id` - Get store details
- `PATCH /api/stores/:id` - Update store (Admin/Store Admin)
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/slug/:slug` - Find store by slug
- `GET /api/stores/:id/stats` - Store statistics
- `GET /api/stores/active` - List active stores only

### 📦 Product Management APIs (11 endpoints)
- `GET /api/products` - List products with pagination
- `POST /api/products` - Create product (Admin/Store Admin)
- `GET /api/products/:id` - Get product details
- `PATCH /api/products/:id` - Update product (Admin/Store Admin)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/slug/:slug` - Find product by slug
- `GET /api/products/sku/:sku` - Find product by SKU
- `GET /api/products/search` - Advanced product search
- `GET /api/products/:id/stats` - Product statistics
- `GET /api/products/brand/:brandId` - Products by brand
- `GET /api/products/store/:storeId` - Products by store

### 🔗 Store-Brand Entitlement APIs (11 endpoints)
- `GET /api/entitlements` - List entitlements (Admin only)
- `POST /api/entitlements` - Create entitlement (Admin only)
- `GET /api/entitlements/:id` - Get entitlement details
- `PATCH /api/entitlements/:id` - Update entitlement (Admin only)
- `DELETE /api/entitlements/:id` - Delete entitlement (Admin only)
- `PATCH /api/entitlements/:id/revoke` - Revoke entitlement
- `GET /api/entitlements/store/:storeId` - Store's entitlements
- `GET /api/entitlements/brand/:brandId` - Brand's entitlements
- `GET /api/entitlements/check/:storeId/:brandId` - Check permission
- `GET /api/entitlements/stats` - Entitlement statistics
- `GET /api/entitlements/active` - Active entitlements only

### 📊 Stock Management APIs (14+ endpoints)
- `GET /api/stock` - List stock records with filters
- `POST /api/stock` - Create stock record
- `GET /api/stock/:id` - Get stock details
- `PATCH /api/stock/:id` - Update stock quantities
- `DELETE /api/stock/:id` - Delete stock record
- `GET /api/stock/store/:storeId` - Stock by store
- `GET /api/stock/product/:productId` - Stock by product
- `POST /api/stock/reserve` - Reserve stock (TTL-based)
- `POST /api/stock/confirm` - Confirm reservation
- `POST /api/stock/release` - Release reservation
- `POST /api/stock/adjust` - Manual stock adjustment
- `GET /api/stock/stats` - Stock statistics
- `POST /api/stock/cleanup` - Cleanup expired reservations
- `GET /api/stock/low` - Low stock alerts

### 🛒 Order Management APIs (16+ endpoints)
- `GET /api/orders` - List orders with filters
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Cancel order
- `GET /api/orders/store/:storeId` - Orders by store
- `PATCH /api/orders/:id/confirm` - Confirm order
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/search` - Advanced order search
- `GET /api/orders/stats` - Order statistics
- `GET /api/orders/attention` - Orders needing attention
- `POST /api/orders/cleanup` - Cleanup expired orders
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Customer details
- `GET /api/customers/search` - Search customers

### 📁 File Upload APIs (2 endpoints)
- `POST /api/uploads/file` - Upload file (images/documents)
- `POST /api/uploads/product-image` - Upload product image

### 🔐 Two-Factor Authentication APIs (6+ endpoints)
- `GET /api/auth/2fa/status` - Check 2FA status
- `POST /api/auth/2fa/generate` - Generate 2FA secret + QR code
- `POST /api/auth/2fa/enable` - Enable 2FA with token verification
- `DELETE /api/auth/2fa/disable` - Disable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA token/backup code
- `POST /api/auth/2fa/backup-codes/regenerate` - Regenerate backup codes

### 🌐 Social Login APIs (5+ endpoints)
- `POST /api/auth/social/google` - Google OAuth login
- `POST /api/auth/social/facebook` - Facebook OAuth login
- `GET /api/auth/social/accounts` - Get linked social accounts
- `POST /api/auth/social/link/{provider}` - Link social account
- `DELETE /api/auth/social/unlink/{provider}` - Unlink social account

### 🛍️ Storefront APIs (Public - 4+ endpoints)
- `GET /api/storefront/:storeSlug` - Store information
- `GET /api/storefront/:storeSlug/products` - Store products
- `GET /api/storefront/:storeSlug/products/:slug` - Product details
- `GET /api/storefront/:storeSlug/products/:id/availability` - Check availability

### 👤 User Management APIs
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/:id` - User details
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### 🔧 System APIs
- `GET /api/health` - System health check
- `GET /api/version` - API version info

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

### 🧪 Comprehensive Testing Suite (160+ Test Cases)

**Location**: `TESTING/` folder with organized test categories:

#### Phase 1-2: Foundation Tests (41 test cases)
- **🔐 Authentication**: 8 tests (`01_Authentication/`)
- **🛡️ Authorization/RBAC**: 8 tests (`02_Authorization_RBAC/`)
- **✅ API Validation**: 13 tests (`03_API_Validation/`)
- **💚 System Health**: 12 tests (`04_System_Health/`)

#### Phase 3: Business Logic Tests (49 test cases)
- **🗄️ Database**: 15 tests (`05_Database/`)
- **🏷️ Brand Management**: 10 tests (`06_Brand_Management/`)
- **🏪 Store Management**: 12 tests (`07_Store_Management/`)
- **📦 Product Management**: 15 tests (`08_Product_Management/`)
- **🔗 Store-Brand Entitlements**: 12 tests (`09_Store_Brand_Entitlements/`)

#### Phase 4: Stock & Order Tests (21+ test cases)
- **📊 Stock Management**: 11+ tests (`10_Stock_Management/`)
- **🛒 Order Management**: 10+ tests (`11_Order_Management/`)

#### Phase 5: E-commerce & File Tests (48+ test cases)
- **📁 File Upload**: 12+ tests (`12_File_Upload/`)
- **🛍️ Storefront APIs**: 12+ tests (`13_Storefront_APIs/`)
- **🔐 Two-Factor Authentication**: 12+ tests (`14_Two_Factor_Auth/`)
- **🌐 Social Login Integration**: 12+ tests (`15_Social_Login/`)

### 🎯 Testing Prerequisites
1. **Backend server**: `npm run start:dev` (http://localhost:3001)
2. **Demo data**: `npm run prisma:seed`
3. **Tools available**:
   - 📖 **Swagger UI**: http://localhost:3001/api/docs
   - 🗄️ **Prisma Studio**: http://localhost:5555 
   - 📧 **MailHog**: http://localhost:8025
   - 💾 **Adminer**: http://localhost:8080

### 🛠️ Testing Tools & Methods
- **cURL Commands**: Ready-to-use commands in each test folder
- **Swagger UI**: Interactive API testing interface
- **Postman/Insomnia**: Import from Swagger documentation
- **Manual Verification**: Step-by-step testing instructions

### 📊 Test Coverage Areas
- **Security**: Authentication, Authorization, RBAC, Input validation
- **Business Logic**: All CRUD operations, business rules, workflows
- **Data Integrity**: Database constraints, relationships, transactions
- **Performance**: Response times, error handling, edge cases
- **Integration**: Multi-module interactions, external services

**See `TESTING/README.md` for complete testing instructions and guidelines.**

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

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and configure the following variables:

### 🗄️ Database Configuration
```env
DATABASE_URL="postgresql://user:password@localhost:5432/interlink"
```

### 🔐 Authentication & Security
```env
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Two-Factor Authentication (2FA)
2FA_ENABLED=true
TOTP_SERVICE_NAME="Interlink System"
TOTP_ISSUER="Interlink"

# Social Login Integration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
```

### ⚙️ Application Settings
```env
NODE_ENV="development"
PORT=3001
APP_NAME="Interlink Backend"
APP_VERSION="1.0.0"
```

### 📁 File Upload Configuration
```env
# Storage Provider: "local" or "s3"
STORAGE_PROVIDER="local"
UPLOAD_PATH="./uploads"
UPLOAD_BASE_URL="http://localhost:3001/uploads"
MAX_FILE_SIZE=52428800  # 50MB

# S3/MinIO Configuration (when STORAGE_PROVIDER=s3)
AWS_S3_ENDPOINT="http://localhost:9000"
AWS_S3_BUCKET_NAME="interlink-dev"
AWS_S3_REGION="us-east-1"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
AWS_S3_FORCE_PATH_STYLE=true
```

### 📧 Email Configuration (Development with MailHog)
```env
SMTP_HOST="localhost"
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="no-reply@interlink.local"
```

### 🌐 Frontend URLs (for CORS and redirects)
```env
FRONTEND_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3000/admin"
STORE_URL="http://localhost:3000/store"
```

### 🛡️ Rate Limiting & Security
```env
THROTTLE_TTL=60
THROTTLE_LIMIT=100
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5
```

### 🔗 External Services (Optional)
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

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

## 🚀 Development Progress & Milestones

### ✅ Phase 1: Backend Core Setup (100% Complete)
- ⚡ **NestJS Application**: Modular architecture with TypeScript
- 🗄️ **Database Setup**: PostgreSQL with Prisma ORM and 15+ tables
- 🐳 **Docker Environment**: Complete development stack
- 🔧 **Development Tools**: ESLint, Prettier, code quality controls
- ❤️ **Health Monitoring**: System health check endpoints

### ✅ Phase 2: Authentication & Authorization (100% Complete)
- 🔐 **JWT Authentication**: Access + Refresh token strategy
- 👥 **Role-Based Access Control**: 5-tier RBAC system
- 🔒 **Security Features**: Password hashing, session management
- 🛡️ **Authorization Guards**: Route-level permission control
- 👤 **User Management**: Complete user lifecycle management

### ✅ Phase 3: Business Logic APIs (100% Complete)
- 🏷️ **Brand Management**: 7 APIs with statistics and search
- 🏪 **Store Management**: 8 APIs with subscription handling
- 📦 **Product Management**: 11 APIs with advanced catalog features
- 🔗 **Entitlement System**: 11 APIs for access control management
- 📊 **Rich Demo Data**: 6 brands, 5 stores, 14+ products
- 📚 **API Documentation**: Complete Swagger documentation

### ✅ Phase 4: Stock & Order Management (100% Complete)
- 📊 **Stock Management**: 14+ APIs with atomic operations
- 🛒 **Order Processing**: 16+ APIs with complete lifecycle
- ⏰ **Reservation System**: TTL-based stock reservations (60 min)
- 👥 **Customer Management**: Guest customer support
- 🧹 **Cleanup Automation**: Expired reservation management
- 📈 **Analytics & Stats**: Stock and order analytics

### ✅ Phase 5: Storefront APIs & File Upload (100% Complete)
- 🛍️ **Public Storefront**: 4+ APIs for e-commerce frontend
- 📁 **File Upload System**: Configurable storage (Local/S3)
- 🔄 **Storage Providers**: Multi-provider abstraction
- 🛡️ **File Security**: Type validation and security checks
- 📱 **Product Catalog**: Public product browsing APIs
- 🔍 **Search & Filter**: Advanced product search capabilities

### 🧪 Complete Testing Suite (140+ Test Cases)
- **Foundation Tests**: Authentication, Authorization, Validation (41 tests)
- **Business Logic Tests**: Brands, Stores, Products, Entitlements (49 tests)
- **Advanced Features**: Stock, Orders, Files, Storefront (50+ tests)
- **Integration Testing**: Multi-module workflows and edge cases
- **Performance Testing**: Load testing and response time validation

### 📊 System Metrics
- **🎯 Total API Endpoints**: 85+ endpoints across all modules
- **🗄️ Database Tables**: 15+ optimized tables with relationships
- **🧪 Test Coverage**: 140+ manual test cases
- **📚 Documentation**: Complete API docs + testing guides
- **🔒 Security**: Multi-layer security with RBAC and validation

### 🎯 Next Phase: Subscription & Payment Management
- 💳 **Payment Processing**: Manual and automated payment handling
- 📅 **Subscription Management**: Store subscription lifecycle
- 🏦 **Billing System**: Invoice generation and tracking
- 📊 **Financial Reports**: Revenue and subscription analytics
- 🔔 **Notification System**: Email alerts and reminders

**🏆 Current Status**: **Phase 1-5 Complete** - Full E-commerce Backend Ready! ✅

**💪 System Capabilities**:
- Complete multi-tenant e-commerce platform
- Real-time stock management with reservations
- Public storefront APIs for customer-facing applications
- Configurable file storage for images and documents
- Comprehensive testing suite for quality assurance
- Production-ready with Docker containerization