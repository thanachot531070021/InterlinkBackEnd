# 🔧 Interlink Backend API Server

## 📋 โปรเจกต์ Backend Overview

**Interlink Backend** เป็น API Server ที่ให้บริการ RESTful APIs สำหรับระบบจัดการร้านค้าและสินค้าแบบ B2B

### 🎯 หน้าที่หลัก
- **Authentication & Authorization**: JWT + OTP + RBAC
- **Business Logic**: จัดการร้านค้า สินค้า สต๊อก ออเดอร์
- **Data Management**: PostgreSQL database + Prisma ORM
- **Background Jobs**: Stock cleanup, notifications, reporting
- **🆕 Store Product Creation**: ระบบให้ร้านสร้างสินค้าเองตามเงื่อนไข

---

## 🏗️ Backend Architecture

### Tech Stack
```
Framework: NestJS (TypeScript)
Database: PostgreSQL + Prisma ORM
Authentication: JWT + OTP + Google OAuth
File Storage: S3-compatible
Background Jobs: node-cron
Documentation: Swagger/OpenAPI
Testing: Jest
Containerization: Docker + Docker Compose
```

### Module Structure
```
src/
├── auth/                    # Authentication & Authorization
├── users/                   # User management (Admin, Store users)
├── stores/                  # Store management
├── brands/                  # Brand management
├── products/                # Product catalog
├── entitlements/            # Store-Brand permissions
├── 🆕 product-permissions/  # Store product creation permissions
├── stocks/                  # Inventory management
├── orders/                  # Order processing
├── reservations/            # Stock reservations (TTL)
├── billing/                 # Subscription management
├── payments/                # Payment processing
├── reporting/               # Analytics & reports
├── notifications/           # Email & alerts
├── uploads/                 # File upload handling
├── common/                  # Shared utilities
└── database/                # Prisma schema & migrations
```

---

## 📊 Database Schema (Core Tables)

### User & Store Management
```sql
users                        # Admin และ Store users
stores                       # ข้อมูลร้านค้า + subscription status
brands                       # ข้อมูลแบรนด์
store_brand_entitlements     # สิทธิ์การขายของแต่ละร้าน
```

### 🆕 Store Product Creation System
```sql
store_product_permissions    # สิทธิ์การสร้างสินค้าของร้าน
├── store_id (FK)
├── brand_id (FK)
├── can_create_products (BOOLEAN)
├── requires_approval (BOOLEAN)
├── max_products_per_month (INTEGER)
├── allowed_categories (JSONB)
├── pricing_rules (JSONB)
└── effective_from/to (TIMESTAMP)

product_approval_queue       # คิวอนุมัติสินค้าที่ร้านสร้าง
├── store_id (FK)
├── brand_id (FK)
├── product_data (JSONB)
├── status (ENUM: PENDING/APPROVED/REJECTED/REVISION_REQUIRED)
├── submitted_by (UUID)
├── reviewed_by (UUID)
├── rejection_reason (TEXT)
└── approved_product_id (UUID)
```

### Product & Inventory
```sql
products                     # สินค้า (Central + Store-created)
├── id, name, sku, description
├── brand_id (FK)
├── created_by_store_id (NULL = central, UUID = store-created)
├── approval_queue_id (FK, NULL = approved/central)
└── status, pricing, images_json

product_variants             # Variants (สี/ไซต์)
store_stock                  # สต๊อกของแต่ละร้าน
reservations                 # การจองสต๊อก (TTL 60 minutes)
```

### Order Management
```sql
customers                    # ลูกค้า (guest allowed)
orders                       # คำสั่งซื้อ
order_items                  # รายการสินค้าในออเดอร์
```

### Billing & Audit
```sql
subscriptions               # การสมัครสมาชิกของร้าน
payments                    # ข้อมูลการชำระเงิน
events_audit                # Audit log ทุกการเปลี่ยนแปลงสำคัญ
```

---

## 🔐 Authentication & Authorization

### JWT Strategy
```typescript
// Access Token (15 minutes)
interface AccessToken {
  sub: string;        // user ID
  email: string;
  role: UserRole;
  storeId?: string;   // สำหรับ Store users
  permissions: string[];
}

// Refresh Token (7 days)
interface RefreshToken {
  sub: string;
  tokenVersion: number;
}
```

### RBAC (Role-Based Access Control)
```typescript
enum UserRole {
  ADMIN = 'ADMIN',                    # Super admin
  STORE_ADMIN = 'STORE_ADMIN',        # เจ้าของร้าน
  STORE_STAFF = 'STORE_STAFF',        # พนักงานร้าน
  SALE = 'SALE',                      # Sale/Agent (future)
  CUSTOMER_GUEST = 'CUSTOMER_GUEST'   # ลูกค้าแบบ guest
}
```

### OTP System
- **Email OTP**: 6-digit codes, 10 minutes expiration
- **Rate Limiting**: 5 attempts per hour per email
- **Templates**: HTML email templates with branding

---

## 🚀 API Endpoints

### Authentication APIs
```
POST   /auth/login           # Email/password login
POST   /auth/otp/request     # Request OTP
POST   /auth/otp/verify      # Verify OTP + get tokens
POST   /auth/oauth/google    # Google OAuth login
POST   /auth/refresh         # Refresh access token
POST   /auth/logout          # Invalidate tokens
GET    /auth/me              # Get current user info
```

### Admin Management APIs
```
# User Management
GET    /admin/users          # List all users
POST   /admin/users          # Create user
PUT    /admin/users/:id      # Update user
DELETE /admin/users/:id      # Delete user

# Brand Management
GET    /admin/brands         # List brands
POST   /admin/brands         # Create brand
PUT    /admin/brands/:id     # Update brand
DELETE /admin/brands/:id     # Delete brand

# Store Management
GET    /admin/stores         # List stores with filters
POST   /admin/stores         # Create store
PUT    /admin/stores/:id     # Update store
PUT    /admin/stores/:id/status  # Update store status (active/suspended)

# Store-Brand Entitlements
GET    /admin/stores/:id/entitlements     # Get store's brand permissions
POST   /admin/stores/:id/entitlements     # Grant brand permission
DELETE /admin/stores/:id/entitlements/:brandId  # Revoke permission
```

### 🆕 Store Product Permission APIs
```
# Permission Management
GET    /admin/stores/:storeId/product-permissions     # Get store's product creation permissions
POST   /admin/stores/:storeId/product-permissions     # Set product creation permissions
PUT    /admin/stores/:storeId/product-permissions     # Update permissions
DELETE /admin/stores/:storeId/product-permissions     # Remove permissions

# Approval Queue Management
GET    /admin/product-approvals                       # List pending approvals
GET    /admin/product-approvals/:id                   # Get approval details
PUT    /admin/product-approvals/:id/approve           # Approve product
PUT    /admin/product-approvals/:id/reject            # Reject with reason
PUT    /admin/product-approvals/:id/request-revision  # Request revision
```

### Store Management APIs
```
# Store Profile
GET    /store/profile        # Get store profile
PUT    /store/profile        # Update store profile

# Product Management
GET    /store/products       # Get store's products (imported + created)
POST   /store/products/import  # Import products from central catalog
POST   /store/products       # 🆕 Create new product (if permitted)

# Stock Management
GET    /store/stock          # Get store's stock
PUT    /store/stock/:productId  # Update stock levels
GET    /store/stock/low      # Get low stock alerts

# Order Management
GET    /store/orders         # List store's orders
GET    /store/orders/:id     # Get order details
PUT    /store/orders/:id/confirm  # Confirm order
PUT    /store/orders/:id/cancel   # Cancel order with reason

# 🆕 Store Product Creation
GET    /store/product-permissions              # Check own permissions
GET    /store/products/create-eligibility      # Check if can create more products
POST   /store/products                         # Create product (auto-submit for approval)
GET    /store/product-submissions              # List submitted products
GET    /store/product-submissions/:id          # Get submission status
PUT    /store/product-submissions/:id          # Update submitted product (revision)
```

### Public Storefront APIs
```
# Store Information
GET    /public/stores/:slug  # Get store info by slug
GET    /public/stores/:slug/products  # Get store's product catalog

# Product Catalog
GET    /public/products      # Public product search/filter
GET    /public/products/:id  # Get product details

# Order Placement (Guest)
POST   /public/customers     # Create guest customer
POST   /public/orders        # Place order (with stock reservation)
GET    /public/orders/:id/track  # Track order status
```

### Reporting APIs
```
# Store Reports
GET    /store/reports/sales      # Sales summary
GET    /store/reports/products   # Product performance
GET    /store/reports/stock      # Stock reports

# Admin Reports
GET    /admin/reports/overview   # System overview
GET    /admin/reports/stores     # Store performance
GET    /admin/reports/products   # 🆕 Store-created product analytics
GET    /admin/reports/export     # Export data (CSV/Excel)
```

---

## ⚙️ Background Jobs

### Stock Management Jobs
```typescript
// ทุก 5 นาที - ปล่อยสต๊อกที่จองหมดเวลา
@Cron('*/5 * * * *')
async cleanupExpiredReservations() {
  // Release reservations where expires_at < NOW()
  // Update store_stock: reserved_qty -= released_qty
}

// ทุก 1 ชั่วโมง - แจ้งเตือนสต๊อกต่ำ
@Cron('0 * * * *')
async notifyLowStock() {
  // Find products with stock < threshold
  // Send email alerts to store owners
}
```

### 🆕 Product Approval Jobs
```typescript
// ทุกเช้า 9:00 - แจ้งเตือน pending approvals
@Cron('0 9 * * *')
async notifyPendingApprovals() {
  // Notify admins about products pending approval > 24h
}

// ทุกวัน - ล้าง quota counter รายเดือน
@Cron('0 0 1 * *')  // 1st of each month
async resetMonthlyQuotas() {
  // Reset monthly product creation counters
}
```

### Subscription Jobs
```typescript
// ทุกวัน 6:00 - ตรวจสอบ subscription หมดอายุ
@Cron('0 6 * * *')
async checkSubscriptionExpiry() {
  // Find subscriptions expiring in 7 days
  // Send renewal reminders
  // Suspend stores with expired subscriptions
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```bash
# Test coverage targets
- Services: 90%+ coverage
- Controllers: 85%+ coverage  
- Guards & Middlewares: 95%+ coverage
- Utilities: 90%+ coverage
```

### Integration Tests
```typescript
// API Integration Tests
describe('Store Product Creation API', () => {
  test('should create product when permitted');
  test('should reject when no permission'); 
  test('should enforce monthly quota');
  test('should require approval when configured');
});

// Database Transaction Tests
describe('Stock Reservation System', () => {
  test('should handle concurrent reservations');
  test('should prevent overselling');
  test('should cleanup expired reservations');
});
```

---

## 🚀 Deployment

### Docker Setup
```yaml
# docker-compose.prod.yml
services:
  api:
    build: 
      context: .
      dockerfile: Dockerfile.prod
    ports: ["3001:3001"]
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on: [db]
    
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=interlink
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on: [api]
```

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/interlink"

# JWT Secrets
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Email (OTP & Notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Storage (S3-compatible)
S3_ENDPOINT="https://s3.amazonaws.com"
S3_BUCKET="interlink-files"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"

# External APIs
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

### Health Checks
```typescript
@Controller('health')
export class HealthController {
  @Get()
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: await this.checkDatabase(),
      storage: await this.checkStorage(),
      email: await this.checkEmail(),
      version: process.env.npm_package_version
    };
  }
}
```

---

## 📈 Performance & Scaling

### Database Optimization
```sql
-- Critical Indexes
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_store_stock_store_product ON store_stock(store_id, product_id);
CREATE INDEX idx_reservations_expires ON reservations(store_id, expires_at, status);
CREATE INDEX idx_orders_store_status ON orders(store_id, status, created_at);
CREATE INDEX idx_products_brand_status ON products(brand_id, status);

-- 🆕 New Indexes for Store Product Creation
CREATE INDEX idx_store_product_permissions_store ON store_product_permissions(store_id, effective_from, effective_to);
CREATE INDEX idx_product_approval_queue_status ON product_approval_queue(status, submitted_at);
```

### Caching Strategy
```typescript
// Redis caching for frequent queries
@Cacheable('store-products', 300) // 5 minutes TTL
async getStoreProducts(storeId: string) {
  return await this.productRepository.findByStore(storeId);
}

// Database query optimization
async getStoreStock(storeId: string) {
  return await this.stockRepository
    .createQueryBuilder('stock')
    .leftJoin('stock.product', 'product')
    .where('stock.store_id = :storeId', { storeId })
    .andWhere('stock.available_qty > 0')
    .getMany();
}
```

### Rate Limiting
```typescript
// API Rate Limiting
@UseGuards(ThrottlerGuard)
@Throttle(100, 60) // 100 requests per minute
@Controller('api')
export class ApiController {}

// OTP Rate Limiting
@Throttle(5, 3600) // 5 OTP requests per hour
@Post('otp/request')
async requestOtp() {}
```

---

## 🔒 Security Measures

### Input Validation
```typescript
// DTO Validation with class-validator
export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];
}
```

### SQL Injection Prevention
```typescript
// Prisma ORM automatically prevents SQL injection
const products = await this.prisma.product.findMany({
  where: {
    brandId: brandId, // Safe parameter binding
    name: {
      contains: searchTerm, // Safe LIKE operation
      mode: 'insensitive'
    }
  }
});
```

### File Upload Security
```typescript
@UseInterceptors(FileInterceptor('image', {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
      return callback(new Error('Only image files allowed'), false);
    }
    callback(null, true);
  }
}))
async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
  // Validate and process image
}
```

---

## 📝 API Documentation

### Swagger Configuration
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Interlink Backend API')
  .setDescription('API documentation for Interlink B2B system')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### API Response Format
```typescript
// Standard API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

*Last Updated: 2025-09-07*  
*Backend Version: 1.0.0*