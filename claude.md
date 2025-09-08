# Interlink System - โปรเจกต์ระบบจัดการร้านค้าและสินค้าแบบ B2B

## 📋 สรุปโปรเจกต์

**Interlink System** เป็นระบบกลางที่เชื่อมโยงระหว่างแบรนด์สินค้า ร้านค้า และลูกค้า โดยแยกเป็น 2 โปรเจกต์:

### 🔧 Backend (API Server) ✅ ACTIVE
- ✅ ระบบกลางจัดเก็บและควบคุมสิทธิ์สินค้าของแต่ละแบรนด์
- ✅ JWT Authentication และ RBAC Authorization
- ✅ API สำหรับจัดการร้านค้า สินค้า และสิทธิ์แบรนด์ (เสร็จสมบูรณ์)
- ✅ **Stock Management APIs**: ระบบจัดการสต๊อกแบบ atomic operations (เสร็จสมบูรณ์)
- ✅ **Order Management APIs**: ระบบการสั่งซื้อพร้อม stock reservation (เสร็จสมบูรณ์)
- ✅ **Storefront APIs**: ระบบ E-commerce หน้าร้านสำหรับลูกค้า (เสร็จสมบูรณ์)
- ✅ **File Upload System**: ระบบอัพโหลดไฟล์แบบ configurable (Local/S3) (เสร็จสมบูรณ์)
- ✅ **Two-Factor Authentication (2FA)**: ระบบ 2FA แบบ TOTP พร้อม QR Code และ Backup Codes (เสร็จสมบูรณ์)
- ✅ **Social Login Integration**: Google OAuth และ Facebook Login สำหรับ CUSTOMER_GUEST (เสร็จสมบูรณ์)
- 📋 ระบบสมาชิกแบบ Subscription สำหรับร้านค้า (รอพัฒนา)
- 📋 **Store Product Creation**: API สำหรับให้ร้านค้าสร้างสินค้าเองตามเงื่อนไข (รอพัฒนา)

### 🎨 Frontend (Web Applications)
- **Admin Dashboard**: จัดการแบรนด์ ร้านค้า และสิทธิ์
- **Store Dashboard**: จัดการสต๊อก ออเดอร์ และสร้างสินค้า
- **Storefront**: หน้าร้านสำหรับลูกค้าสั่งซื้อ (Public)
- ระบบ Authentication UI และการจัดการ session

## 🎯 วัตถุประสงค์หลัก

1. **ควบคุมสิทธิ์การขาย**: กำหนดว่าร้านไหนสามารถขายสินค้าของแบรนด์ไหนได้
2. **จัดการสต๊อกแยกร้าน**: แต่ละร้านมีสต๊อกของตัวเองแยกจากระบบกลาง
3. **การจองสต๊อกอัตโนมัติ**: เมื่อลูกค้าสั่งซื้อ ระบบจะจองสต๊อกรอร้านยืนยัน
4. **Subscription Model**: ร้านค้าต้องสมัครสมาชิกเพื่อใช้งาน
5. **🆕 ควบคุมสิทธิ์การสร้างสินค้า**: Admin กำหนดเงื่อนไขว่าร้านไหนสามารถสร้างสินค้าเองได้

## 🏗️ สถาปัตยกรรมระบบ

---

# 🔧 BACKEND ARCHITECTURE

## Backend Stack
- **Framework**: NestJS แบบ Modular Monolith
- **Database**: PostgreSQL (1 instance)
- **ORM**: Prisma
- **Authentication**: JWT + OTP + 2FA (TOTP) + Social Login
- **File Storage**: S3-compatible หรือ local storage
- **Background Jobs**: node-cron (in-process scheduler)
- **API Documentation**: Swagger/OpenAPI

## Backend Modules
```
├── auth/                    # ✅ Authentication & Authorization (เสร็จสมบูรณ์)
│   ├── two-factor/         # ✅ 2FA TOTP System (เสร็จสมบูรณ์)
│   └── social/             # ✅ Social Login Integration (เสร็จสมบูรณ์)
├── users/                   # ✅ User management (เสร็จสมบูรณ์)
├── stores/                  # ✅ Store management (เสร็จสมบูรณ์)
├── brands/                  # ✅ Brand management (เสร็จสมบูรณ์)
├── products/                # ✅ Product catalog (เสร็จสมบูรณ์)
├── entitlements/            # ✅ Store-Brand permissions (เสร็จสมบูรณ์)
├── 🆕 product-permissions/  # Store product creation permissions (รอพัฒนา)
├── stock/                   # ✅ Inventory management (Phase 4) - เสร็จสมบูรณ์
├── orders/                  # ✅ Order processing (Phase 4) - เสร็จสมบูรณ์
├── storefront/              # ✅ Public storefront APIs (Phase 5) - เสร็จสมบูรณ์
├── uploads/                 # ✅ File upload handling (Phase 5) - เสร็จสมบูรณ์
├── billing/                 # Subscription & payments (รอพัฒนา)
├── payments/                # Payment processing (รอพัฒนา)
├── reporting/               # Analytics & reports (รอพัฒนา)
└── notifications/           # Email & alerts (รอพัฒนา)
```

## Database Design
- **PostgreSQL** (1 instance)
- แยกข้อมูลด้วย store_id/tenant_id
- วางแผน Row Level Security (RLS) สำหรับความปลอดภัย
- Indexes สำคัญสำหรับ performance

## Background Jobs
- **node-cron** (in-process scheduler)
- จัดการ reservation ที่หมดเวลา
- ส่ง notifications
- 🆕 Product approval reminders

## API Design Principles
- RESTful APIs
- Consistent error handling
- Request/Response validation
- Rate limiting
- API versioning support

---

# 🎨 FRONTEND ARCHITECTURE

## Frontend Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand หรือ Redux Toolkit
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios หรือ native fetch
- **Authentication**: NextAuth.js หรือ custom JWT handling

## Frontend Applications

### 1. Admin Dashboard (`/admin`)
- **Purpose**: จัดการระบบโดย Super Admin
- **Features**:
  - Brand management
  - Store management
  - Product catalog management
  - 🆕 Store product permissions
  - 🆕 Product approval queue
  - System-wide analytics
  - User management

### 2. Store Dashboard (`/store`)
- **Purpose**: จัดการร้านค้าโดย Store owners
- **Features**:
  - Store profile management
  - Product import from catalog
  - 🆕 Create own products
  - Stock management
  - Order management
  - Sales reports
  - Subscription management

### 3. Storefront (`/shop/{storeSlug}`)
- **Purpose**: หน้าร้านสำหรับลูกค้า (Public)
- **Features**:
  - Product catalog display
  - Shopping cart
  - Guest checkout
  - Order tracking
  - Mobile responsive

## Frontend Routing Strategy
```
├── /admin/*              # Admin Dashboard (Protected)
├── /store/*              # Store Dashboard (Protected)
├── /shop/{storeSlug}/*   # Public Storefront (SSR/ISR)
├── /auth/*               # Authentication pages
└── /api/*                # API routes (if using Next.js API)
```

## Rendering Strategy
- **Admin/Store Dashboards**: CSR (Client-Side Rendering)
- **Storefront**: ISR/SSR (Incremental Static Regeneration/Server-Side Rendering)
- **Authentication**: CSR with proper redirects

## 📊 โมเดลข้อมูลหลัก

### ตารางสำคัญ
```
stores - ข้อมูลร้านค้า
brands - ข้อมูลแบรนด์
store_brand_entitlements - สิทธิ์การขายของแต่ละร้าน
🆕 store_product_permissions - สิทธิ์การสร้างสินค้าของร้าน
products - รายการสินค้า (จาก central + store-created)
product_variants - variants ของสินค้า (สี/ไซต์)
store_stock - สต๊อกของแต่ละร้าน
orders - คำสั่งซื้อ
order_items - รายการสินค้าในคำสั่งซื้อ
reservations - การจองสต๊อก
customers - ข้อมูลลูกค้า (guest allowed)
subscriptions - การสมัครสมาชิกของร้าน
🆕 product_approval_queue - คิวอนุมัติสินค้าที่ร้านสร้าง
```

### 🆕 โมเดลใหม่: Store Product Permissions

#### store_product_permissions
```sql
id: UUID (PK)
store_id: UUID (FK -> stores.id)
brand_id: UUID (FK -> brands.id) 
can_create_products: BOOLEAN (อนุญาตสร้างสินค้าได้/ไม่ได้)
requires_approval: BOOLEAN (ต้องได้รับการอนุมัติจาก Admin/Brand)
max_products_per_month: INTEGER (จำกัดจำนวนสินค้าต่อเดือน, NULL = ไม่จำกัด)
allowed_categories: JSONB (หมวดหมู่ที่อนุญาต, NULL = ทั้งหมด)
pricing_rules: JSONB (กฎการตั้งราคา เช่น markup ขั้นต่ำ/สูงสุด)
effective_from: TIMESTAMP
effective_to: TIMESTAMP
created_by: UUID (Admin ที่สร้างกฎ)
updated_at: TIMESTAMP
created_at: TIMESTAMP

UNIQUE(store_id, brand_id)
INDEX(store_id, effective_from, effective_to)
```

#### product_approval_queue
```sql
id: UUID (PK)
store_id: UUID (FK)
brand_id: UUID (FK)
product_data: JSONB (ข้อมูลสินค้าที่ร้านส่งมา)
status: ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED')
submitted_by: UUID (Store user ที่ส่ง)
reviewed_by: UUID (Admin/Brand user ที่รีวิว)
rejection_reason: TEXT
revision_notes: TEXT
approved_product_id: UUID (หลังอนุมัติแล้ว link ไป products.id)
submitted_at: TIMESTAMP
reviewed_at: TIMESTAMP
```

## 🔄 Flow การทำงานหลัก (อัพเดต)

1. **Admin** สร้างแบรนด์และรายการสินค้า
2. **Admin** สร้างร้านค้าและกำหนดสิทธิ์แบรนด์
3. **🆕 Admin** กำหนดเงื่อนไขการสร้างสินค้าสำหรับแต่ละร้าน
4. **ร้านค้า** ล็อกอินและดึงสินค้าเข้าสต๊อก
5. **🆕 ร้านค้า** สร้างสินค้าเอง (ถ้าได้รับอนุญาต) และส่งเข้าคิวอนุมัติ
6. **🆕 Admin/Brand** รีวิวและอนุมัติ/ปฏิเสธ สินค้าที่ร้านส่งมา
7. **ร้านค้า** ส่งลิงก์ร้านให้ลูกค้า
8. **ลูกค้า** สั่งซื้อผ่านลิงก์ (ไม่ต้องสมัครสมาชิก)
9. **ระบบ** จองสต๊อกรอร้านยืนยัน/ยกเลิก
10. **ระบบ** สรุปยอดขายและรายงาน

## 🆕 ฟีเจอร์ใหม่: การสร้างสินค้าโดยร้านค้า

### สิทธิ์และเงื่อนไข (Admin Control)
1. **เปิด/ปิดสิทธิ์**: Admin กำหนดว่าร้านไหนสามารถสร้างสินค้าได้
2. **ต้องอนุมัติ**: กำหนดว่าต้องผ่านการอนุมัติจาก Admin/Brand ก่อนขาย
3. **จำกัดจำนวน**: กำหนดจำนวนสินค้าสูงสุดที่สร้างได้ต่อเดือน
4. **จำกัดหมวดหมู่**: กำหนดหมวดหมู่สินค้าที่อนุญาตให้สร้าง
5. **กฎการตั้งราคา**: กำหนด markup ขั้นต่ำ/สูงสุด หรือช่วงราคาที่อนุญาต

### Store Product Creation Workflow
1. **ตรวจสิทธิ์**: ร้านตรวจสอบว่าตนเองมีสิทธิ์สร้างสินค้าใน brand นั้นหรือไม่
2. **สร้างสินค้า**: ร้านกรอกข้อมูลสินค้า (ชื่อ, รายละเอียด, ราคา, รูปภาพ)
3. **ตรวจสอบเงื่อนไข**: ระบบตรวจสอบเงื่อนไขต่าง ๆ (หมวดหมู่, ราคา, จำนวน)
4. **ส่งเข้าคิว**: หากต้องอนุมัติ → ส่งเข้า approval queue, หากไม่ต้อง → สร้างสินค้าทันที
5. **การอนุมัติ**: Admin/Brand รีวิวและตัดสิน (APPROVED/REJECTED/REVISION_REQUIRED)
6. **แจ้งผล**: แจ้งร้านผลการอนุมัติผ่านอีเมล/dashboard

## 🔒 ระบบความปลอดภัย

### Authentication & Authorization
- **JWT** (access + refresh tokens)
- **RBAC**: ADMIN, STORE_ADMIN, STORE_STAFF, SALE, CUSTOMER_GUEST
- **OTP**: Email OTP (6 หลัก) + rate limiting
- **✅ 2FA**: TOTP-based Two-Factor Authentication with backup codes (เสร็จสมบูรณ์)
- **✅ Social Login**: Google OAuth และ Facebook Login สำหรับ CUSTOMER_GUEST (เสร็จสมบูรณ์)
- **SSO**: Multi-provider social authentication support

### Data Security
- แยกสิทธิ์ตาม role และ store_id
- เข้ารหัสข้อมูลอ่อนไหว
- reCAPTCHA ที่ฟอร์มสำคัญ
- Row Level Security (RLS) แบบ phase-in
- **🆕 Product Permission Check**: ตรวจสอบสิทธิ์การสร้างสินค้าทุก request

## 💰 ระบบการชำระเงิน

### Phase 1 (Manual)
- แนบสลิป/โอน/COD
- Admin ตรวจสอบและอนุมัติ

### Phase 2 (Automated)  
- เตรียม interface รองรับ Stripe/Omise/2C2P/PromptPay
- ระบบ Subscription อัตโนมัติ

## 📈 แผนการพัฒนา (แยกตาม Project)

---

# 🔧 BACKEND DEVELOPMENT PLAN

### Phase 1: Backend Core Setup
1. **ตั้งโปรเจกต์ NestJS** + Prisma + PostgreSQL
2. **Database Schema** สำหรับ core tables
3. **Authentication Module** (JWT + OTP)
4. **Authorization Guards** และ RBAC system
5. **Basic CRUD APIs** สำหรับ stores, brands, products

### Phase 2: Business Logic APIs
6. **Store-Brand Entitlements** API
7. **Stock Management** APIs
8. **Order Processing** APIs với reservation system
9. **🆕 Store Product Permissions** APIs
10. **🆕 Product Approval Queue** APIs

### Phase 3: Advanced Backend Features  
11. **Background Jobs** (cron scheduler)
12. **Notification System** (email templates)
13. **Reporting APIs** และ analytics
14. **File Upload** handling
15. **API Documentation** (Swagger)

### Phase 4: Backend Testing & Deployment
16. **Unit Tests** สำหรับ core modules
17. **Integration Tests** สำหรับ APIs
18. **Docker Setup** และ deployment preparation
19. **Database Migrations** และ seeding
20. **Performance Optimization**

---

# 🎨 FRONTEND DEVELOPMENT PLAN

### Phase 1: Frontend Core Setup
1. **ตั้งโปรเจกต์ Next.js** (App Router) + TypeScript
2. **Authentication System** (JWT handling)
3. **Base Components** และ UI library setup
4. **Routing Structure** สำหรับ admin/store/shop
5. **API Integration** setup (HTTP client)

### Phase 2: Admin Dashboard
6. **Admin Login** และ dashboard layout
7. **Brand Management** pages (CRUD)
8. **Store Management** pages (CRUD)  
9. **Product Catalog** management
10. **🆕 Store Product Permissions** management UI
11. **🆕 Product Approval Queue** interface

### Phase 3: Store Dashboard
12. **Store Login** และ dashboard layout
13. **Store Profile** management
14. **Product Import** interface
15. **🆕 Store Product Creation** forms
16. **Stock Management** interface
17. **Order Management** pages
18. **Sales Reports** dashboard

### Phase 4: Public Storefront
19. **Storefront Layout** (responsive design)
20. **Product Catalog** display (SSR/ISR)
21. **Shopping Cart** functionality
22. **Guest Checkout** process
23. **Order Confirmation** และ tracking

### Phase 5: Frontend Polish & Testing
24. **Mobile Optimization**
25. **Performance Optimization** (loading, caching)
26. **Error Handling** และ user feedback
27. **E2E Testing** (Cypress หรือ Playwright)
28. **Accessibility** improvements

## 🚀 การ Hosting และ Deployment

---

# 🔧 BACKEND HOSTING

### Backend Infrastructure
- **Server**: 1 VPS (2-4 vCPU / 4-8GB RAM)
- **Container**: Docker + Docker Compose
- **Reverse Proxy**: nginx (SSL termination, rate limiting)
- **Database**: PostgreSQL (same server หรือ managed service)
- **File Storage**: S3-compatible service หรือ local + CDN
- **Domain**: `api.yourcompany.com`

### Backend Environment Setup
```yaml
# docker-compose.yml (example)
services:
  api:
    build: ./backend
    ports: ["3001:3001"]
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=interlink
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Backend Monitoring
- **Logs**: Structured JSON logs with Winston
- **Health Checks**: `/health` endpoint
- **Error Tracking**: Sentry (free plan)
- **Database Backup**: pg_dump รายคืน → object storage
- **API Monitoring**: Uptime monitoring service

---

# 🎨 FRONTEND HOSTING

### Frontend Infrastructure
- **Hosting**: Vercel หรือ Netlify (สำหรับ Next.js)
- **Alternative**: Static hosting + CDN (Cloudflare Pages)
- **Domain**: `app.yourcompany.com` (admin/store), `shop.yourcompany.com` (storefront)
- **SSL**: Automatic (provided by hosting service)

### Frontend Environment Setup
```bash
# Environment Variables
NEXT_PUBLIC_API_URL=https://api.yourcompany.com
NEXT_PUBLIC_APP_URL=https://app.yourcompany.com  
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=${NEXTAUTH_URL}
```

### Frontend Deployment Strategy
- **Admin/Store Dashboard**: สามารถ deploy ใน subdirectory เดียวกัน
- **Storefront**: อาจแยก deploy เป็นคนละ project สำหรับ performance
- **Build Optimization**: Static export สำหรับ storefront pages
- **CDN**: Auto-managed โดย hosting provider

## 📊 เป้าหมายประสิทธิภาพ

- รองรับ **100-200 RPS** ในช่วง peak
- ใช้ atomic SQL + ISR + lightweight queues
- Scale plan: เพิ่ม RAM → แยก DB → เพิ่ม Redis/BullMQ

## 🔮 แผนอนาคต

1. **Multi-brand expansion**: ขยายรองรับหลายแบรนด์
2. **Sale/Agent system**: ระบบ sale ดูข้อมูลร้านตามสิทธิ์
3. **Advanced payments**: เชื่อม payment gateways
4. **Mobile app**: พัฒนา mobile application
5. **Analytics & BI**: รายงานขั้นสูงและ business intelligence
6. **🆕 AI Product Suggestion**: แนะนำสินค้าที่ควรสร้างตาม trend
7. **🆕 Advanced Product Templates**: เทมเพลตสินค้าสำหรับร้านสร้าง

---

## 🛠️ Tech Stack Summary

---

# 🔧 BACKEND TECH STACK

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | NestJS | API server framework |
| **Language** | TypeScript | Type-safe development |
| **Database** | PostgreSQL | Primary database |
| **ORM** | Prisma | Database access & migrations |
| **Authentication** | JWT + OTP | User authentication |
| **Validation** | class-validator | Request validation |
| **Documentation** | Swagger/OpenAPI | API documentation |
| **File Storage** | S3-compatible | Image/file storage |
| **Background Jobs** | node-cron | Scheduled tasks |
| **Email** | Nodemailer | Email notifications |
| **Testing** | Jest | Unit & integration tests |
| **Logging** | Winston | Structured logging |
| **Container** | Docker | Containerization |

---

# 🎨 FRONTEND TECH STACK

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js (App Router) | React-based web framework |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **UI Components** | shadcn/ui หรือ Ant Design | Pre-built components |
| **State Management** | Zustand หรือ Redux Toolkit | Client state management |
| **Form Handling** | React Hook Form + Zod | Form validation |
| **HTTP Client** | Axios หรือ TanStack Query | API communication |
| **Authentication** | NextAuth.js | Session management |
| **Charts** | Recharts หรือ Chart.js | Data visualization |
| **Testing** | Jest + Cypress | Unit & E2E testing |
| **Build Tools** | Next.js built-in | Bundling & optimization |

---

## 🆕 **Public APIs - Guest Access (Phase 6 Completed)**

### 🌐 **Public APIs (ไม่ต้อง Authentication)**
เพิ่ม Public APIs สำหรับ Guest Users ให้สามารถดูข้อมูลก่อนตัดสินใจ Login/สมัครสมาชิก:

#### 📦 **Product APIs (Public)**
```
GET    /api/public/products                            # ดูสินค้าทั้งหมด (พร้อม filters)
GET    /api/public/products/{id}                       # ดูรายละเอียดสินค้า + ร้านที่มีขาย
```

#### 🏷️ **Brand APIs (Public)**
```
GET    /api/public/brands                              # ดูแบรนด์ทั้งหมด
GET    /api/public/brands/{id}                         # ดูรายละเอียดแบรนด์ + สินค้า
```

#### 🏪 **Store APIs (Public)**  
```
GET    /api/public/stores                              # ดูร้านค้าทั้งหมด
```

#### 🔍 **Search & Discovery APIs (Public)**
```
GET    /api/public/categories                          # ดูหมวดหมู่สินค้าทั้งหมด
GET    /api/public/search/suggestions?q={query}        # แนะนำการค้นหา (autocomplete)
```

#### 🛍️ **Enhanced Storefront APIs (Public)**
```
GET    /api/storefront/products/all                    # ดูสินค้าทั้งหมด (ข้าม store-specific)
GET    /api/storefront/{storeSlug}                     # ดูข้อมูลร้าน
GET    /api/storefront/{storeSlug}/products            # ดูสินค้าในร้าน  
GET    /api/storefront/{storeSlug}/products/{productSlug}  # ดูรายละเอียดสินค้า
GET    /api/storefront/{storeSlug}/categories          # ดูหมวดหมู่ในร้าน
GET    /api/storefront/{storeSlug}/brands              # ดูแบรนด์ในร้าน
```

### 🎯 **Perfect E-commerce UX Flow:**
1. **🌐 Browse (No Auth)**: ลูกค้าดูสินค้า/ร้าน/แบรนด์ได้ก่อน
2. **🔍 Search & Filter (No Auth)**: หาสินค้าที่ต้องการ
3. **👀 Compare (No Auth)**: เปรียบเทียบราคาและร้านค้า
4. **🔒 Login to Purchase**: ล็อกอินเมื่อต้องการสั่งซื้อ
5. **🛒 Transaction (Auth)**: ทำรายการซื้อขาย

### 🛡️ **Security Features:**
- **Rate Limiting**: ป้องกัน API abuse จาก public endpoints
- **Data Filtering**: แสดงเฉพาะข้อมูลที่เหมาะสม (ไม่มีข้อมูลราคาต้นทุน)
- **Cache-friendly**: เหมาะสำหรับ CDN caching

---

## 🆕 API Endpoints (Store Product Creation)

### Admin APIs
```
GET    /admin/stores/{storeId}/product-permissions     # ดูสิทธิ์การสร้างสินค้า
POST   /admin/stores/{storeId}/product-permissions     # ตั้งค่าสิทธิ์การสร้างสินค้า
PUT    /admin/stores/{storeId}/product-permissions     # แก้ไขสิทธิ์การสร้างสินค้า
DELETE /admin/stores/{storeId}/product-permissions     # ลบสิทธิ์การสร้างสินค้า

GET    /admin/product-approvals                        # ดูคิวอนุมัติสินค้าทั้งหมด
GET    /admin/product-approvals/{id}                    # ดูรายละเอียดการขออนุมัติ
PUT    /admin/product-approvals/{id}/approve            # อนุมัติสินค้า
PUT    /admin/product-approvals/{id}/reject             # ปฏิเสธสินค้า
PUT    /admin/product-approvals/{id}/request-revision   # ขอแก้ไข
```

### Store APIs
```
GET    /store/product-permissions                      # ตรวจสอบสิทธิ์การสร้างสินค้าของร้านตัวเอง
GET    /store/products/create-eligibility              # ตรวจสอบว่าสร้างสินค้าเพิ่มได้หรือไม่
POST   /store/products                                 # สร้างสินค้าใหม่
GET    /store/product-submissions                      # ดูรายการสินค้าที่ส่งขออนุมัติ
GET    /store/product-submissions/{id}                 # ดูสถานะการขออนุมัติ
PUT    /store/product-submissions/{id}                 # แก้ไขสินค้าที่ขอให้ revision
```

---

## 📊 **Current API Statistics (Updated)**

### 🎯 **Total API Endpoints: 95+ APIs**
- **🔐 Authentication APIs**: 8 endpoints
- **🏷️ Brand Management**: 7 endpoints  
- **🏪 Store Management**: 8 endpoints
- **📦 Product Management**: 11 endpoints
- **🔗 Store-Brand Entitlements**: 11 endpoints
- **📊 Stock Management**: 14 endpoints
- **🛒 Order Management**: 16 endpoints
- **📁 File Upload**: 10 endpoints
- **🛍️ Storefront (Public)**: 8 endpoints
- **🌐 Public APIs (New)**: 8 endpoints
- **🔐 Two-Factor Auth**: 6 endpoints
- **🌐 Social Login**: 5 endpoints
- **👤 User Management**: 5 endpoints

### 🏗️ **Architecture Highlights:**
- **Public/Private API Separation**: Clear distinction between guest and authenticated access
- **Rate Limiting**: Comprehensive protection for public endpoints  
- **Rich Examples**: Complete Swagger documentation with real-world examples
- **Mobile-First**: APIs optimized for mobile app consumption
- **SEO-Friendly**: Public APIs support search engine indexing

---

*เอกสารนี้จะอัพเดตตามความก้าวหน้าของโปรเจกต์ - Last Updated: Phase 6 (Public APIs)*