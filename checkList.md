# ✅ Interlink System - Development Checklist (Backend & Frontend)

## 📋 สถานะโปรเจกต์: 🚀 เริ่มต้น (Planning Phase)

**โปรเจกต์นี้แยกเป็น 2 ส่วน**: 🔧 **Backend** (API Server) และ 🎨 **Frontend** (Web Applications)

---

# 🔧 BACKEND DEVELOPMENT CHECKLIST

## 📦 Phase 1: Backend Project Setup

### 1.1 Backend Infrastructure
- [ ] **สร้างโปรเจกต์ NestJS** (TypeScript)
- [ ] **ตั้งค่า Prisma ORM** + PostgreSQL schema
- [ ] **ตั้งค่า Docker Compose** (dev environment)
- [ ] **ตั้งค่า ESLint + Prettier** (backend code formatting)
- [ ] **ตั้งค่า environment variables** (.env management)
- [ ] **ตั้งค่า Swagger/OpenAPI** documentation

### 1.2 Database Schema Design
- [ ] **สร้าง Prisma schema** สำหรับ core tables:
  - [ ] `users` table (admin, store users)
  - [ ] `stores` table
  - [ ] `brands` table  
  - [ ] `store_brand_entitlements` table
  - [ ] **🆕** `store_product_permissions` table
  - [ ] `products` table (central + store-created)
  - [ ] `product_variants` table
  - [ ] `store_stock` table
  - [ ] `orders` table
  - [ ] `order_items` table
  - [ ] `reservations` table
  - [ ] `customers` table
  - [ ] `subscriptions` table
  - [ ] `payments` table
  - [ ] `events_audit` table
  - [ ] **🆕** `product_approval_queue` table
- [ ] **สร้าง database indexes** สำหรับ performance
- [ ] **ทดสอบ database migrations**
- [ ] **สร้าง seed data** สำหรับ development

---

## 🔐 Phase 2: Backend Authentication & Authorization

### 2.1 Core Auth System
- [ ] **JWT authentication** module (access + refresh tokens)
- [ ] **RBAC system** (ADMIN, STORE_ADMIN, STORE_STAFF, SALE, CUSTOMER_GUEST)
- [ ] **Password hashing** (bcrypt)
- [ ] **Auth guards** for NestJS routes
- [ ] **🆕 Product permission guards** สำหรับตรวจสอบสิทธิ์การสร้างสินค้า
- [ ] **Rate limiting** middleware

### 2.2 OTP & External Auth
- [ ] **Email OTP system** (6-digit codes + expiration)
- [ ] **OTP rate limiting** (per email/IP)
- [ ] **Google OAuth** integration
- [ ] **Email templates** สำหรับ OTP และ notifications

### 2.3 Security Features
- [ ] **Input validation** pipes (class-validator)
- [ ] **CORS** configuration
- [ ] **Helmet** security headers
- [ ] **Request sanitization**

---

## 🏪 Phase 3: Backend Business Logic APIs

### 3.1 Admin Management APIs
- [ ] **User management** APIs (CRUD)
- [ ] **Brand management** APIs (CRUD)
- [ ] **Store management** APIs (CRUD + status control)
- [ ] **Store-Brand entitlements** APIs
- [ ] **🆕 Store Product Permissions** APIs (CRUD)
- [ ] **Admin dashboard** summary APIs

### 3.2 Store Management APIs
- [ ] **Store profile** APIs
- [ ] **Product import** APIs (from central catalog)
- [ ] **🆕 Store product creation** APIs
- [ ] **Stock management** APIs
- [ ] **Order management** APIs
- [ ] **Sales reporting** APIs

### 3.3 Stock & Order Processing APIs
- [ ] **Atomic stock updates** (prevent race conditions)
- [ ] **Stock reservation** system (60-minute TTL)
- [ ] **Idempotency handling** for checkout
- [ ] **Order status** management APIs
- [ ] **Order cancellation** with stock release

### 3.4 🆕 Product Approval System APIs
- [ ] **Product submission** APIs
- [ ] **Approval queue** management APIs
- [ ] **Approval workflow** APIs (approve/reject/revision)
- [ ] **Product permission checking** APIs
- [ ] **Monthly quota tracking** APIs

---

## 🛒 Phase 4: Backend Customer & Public APIs

### 4.1 Storefront APIs
- [ ] **Public product catalog** APIs (with caching)
- [ ] **Store information** APIs
- [ ] **Guest customer** creation APIs
- [ ] **Order placement** APIs (with reservation)
- [ ] **Order tracking** APIs

### 4.2 File Upload & Media
- [ ] **Image upload** handling (products)
- [ ] **File validation** and processing
- [ ] **S3/storage** integration
- [ ] **Image optimization** pipeline

---

## 💳 Phase 5: Backend Subscription & Payments

### 5.1 Subscription Management APIs
- [ ] **Subscription** CRUD APIs
- [ ] **Subscription status** tracking
- [ ] **Store access control** based on subscription
- [ ] **Grace period** handling

### 5.2 Payment System APIs
- [ ] **Payment interface** design
- [ ] **Manual payment** verification APIs
- [ ] **Payment status** tracking
- [ ] **Payment gateway** integration preparation

---

## 📊 Phase 6: Backend Reporting & Analytics APIs

### 6.1 Reporting APIs
- [ ] **Store sales** summary APIs
- [ ] **Stock reports** APIs
- [ ] **Order analytics** APIs
- [ ] **🆕 Store product performance** APIs
- [ ] **Cross-store analytics** APIs (admin only)
- [ ] **Data export** APIs (CSV/Excel)

---

## ⚙️ Phase 7: Backend Background Jobs & Automation

### 7.1 Job Scheduler
- [ ] **node-cron** setup and configuration
- [ ] **Reservation cleanup** jobs
- [ ] **Subscription expiry** checks
- [ ] **🆕 Product approval reminders**
- [ ] **Database cleanup** jobs

### 7.2 Notification System
- [ ] **Email service** integration (Nodemailer)
- [ ] **Email templates** system
- [ ] **Notification queue** system
- [ ] **🆕 Product approval notifications**
- [ ] **Order confirmation** emails
- [ ] **Low stock alerts**

---

## 🧪 Phase 8: Backend Testing & Quality

### 8.1 Backend Testing
- [ ] **Unit tests** สำหรับ core services
- [ ] **Integration tests** สำหรับ APIs
- [ ] **Database transaction** tests
- [ ] **Multi-tenant isolation** tests
- [ ] **🆕 Product permission** tests
- [ ] **Stock correctness** stress tests

### 8.2 Backend Code Quality
- [ ] **TypeScript strict mode**
- [ ] **Code coverage** reports (>80%)
- [ ] **API documentation** completeness
- [ ] **Security audit** (dependencies)

---

## 🚀 Phase 9: Backend Deployment & Infrastructure

### 9.1 Backend Containerization
- [ ] **Production Dockerfile**
- [ ] **Docker Compose** production setup
- [ ] **nginx** reverse proxy configuration
- [ ] **SSL/TLS** setup

### 9.2 Backend Database & Monitoring
- [ ] **PostgreSQL** production setup
- [ ] **Database backup** strategy
- [ ] **Structured logging** (Winston)
- [ ] **Health check** endpoints
- [ ] **Error tracking** (Sentry)
- [ ] **API monitoring** setup

---

# 🎨 FRONTEND DEVELOPMENT CHECKLIST

## 📦 Phase 1: Frontend Project Setup

### 1.1 Frontend Infrastructure
- [ ] **สร้างโปรเจกต์ Next.js** (App Router + TypeScript)
- [ ] **ตั้งค่า Tailwind CSS** + UI library
- [ ] **ตั้งค่า ESLint + Prettier** (frontend code formatting)
- [ ] **ตั้งค่า environment variables** (.env.local)
- [ ] **ตั้งค่า path aliases** (@/, @components/, etc.)

### 1.2 Frontend Base Setup
- [ ] **Authentication system** setup (NextAuth.js)
- [ ] **HTTP client** setup (Axios หรือ Fetch wrapper)
- [ ] **State management** setup (Zustand หรือ Redux)
- [ ] **Form handling** setup (React Hook Form + Zod)
- [ ] **Routing structure** planning

---

## 🔐 Phase 2: Frontend Authentication

### 2.1 Auth Pages & Components
- [ ] **Login page** (/auth/login)
- [ ] **OTP verification** page
- [ ] **Google OAuth** integration
- [ ] **Protected route** wrapper
- [ ] **Auth context** และ hooks
- [ ] **Session management**

### 2.2 Auth UI Components
- [ ] **Login form** component
- [ ] **OTP input** component  
- [ ] **Loading states** สำหรับ auth
- [ ] **Error handling** สำหรับ auth
- [ ] **Logout** functionality

---

## 🏪 Phase 3: Frontend Admin Dashboard

### 3.1 Admin Layout & Navigation
- [ ] **Admin dashboard** layout
- [ ] **Sidebar navigation**
- [ ] **Header** with user menu
- [ ] **Breadcrumb** navigation
- [ ] **Loading** และ error states

### 3.2 Admin Management Pages
- [ ] **Brand management** pages (list, create, edit)
- [ ] **Store management** pages (list, create, edit, status)
- [ ] **Product catalog** management
- [ ] **User management** pages
- [ ] **System analytics** dashboard

### 3.3 🆕 Admin Product Approval
- [ ] **🆕 Store Product Permissions** management UI
- [ ] **🆕 Product approval queue** interface
- [ ] **🆕 Approval workflow** UI (approve/reject/revision)
- [ ] **🆕 Permission templates** management

---

## 🏬 Phase 4: Frontend Store Dashboard

### 4.1 Store Layout & Navigation
- [ ] **Store dashboard** layout
- [ ] **Store-specific** navigation menu
- [ ] **Store profile** header
- [ ] **Quick stats** widgets

### 4.2 Store Management Pages
- [ ] **Store profile** management page
- [ ] **Product import** interface
- [ ] **Stock management** pages (list, edit)
- [ ] **Order management** pages (list, details, actions)
- [ ] **Sales reports** dashboard

### 4.3 🆕 Store Product Creation
- [ ] **🆕 Product creation** form with validation
- [ ] **🆕 Permission checking** UI
- [ ] **🆕 Product submission** workflow
- [ ] **🆕 Approval status** tracking
- [ ] **🆕 Monthly quota** display

---

## 🛒 Phase 5: Frontend Public Storefront

### 5.1 Storefront Layout (SSR/ISR)
- [ ] **Storefront layout** (responsive design)
- [ ] **Product catalog** pages (SSR/ISR)
- [ ] **Product detail** pages (SSR)
- [ ] **Category/search** pages
- [ ] **Mobile optimization**

### 5.2 Shopping Experience
- [ ] **Shopping cart** functionality
- [ ] **Guest checkout** process
- [ ] **Order confirmation** page
- [ ] **Order tracking** page
- [ ] **Customer info** form

---

## 📊 Phase 6: Frontend Data & Charts

### 6.1 Dashboard Components
- [ ] **Chart components** (Recharts หรือ Chart.js)
- [ ] **Data tables** with sorting/filtering
- [ ] **Export functionality** (CSV/Excel)
- [ ] **Date range pickers**
- [ ] **Dashboard widgets**

### 6.2 Reporting Interfaces
- [ ] **Sales analytics** charts
- [ ] **Stock reports** tables
- [ ] **🆕 Store product performance** charts
- [ ] **System metrics** dashboard

---

## 🎨 Phase 7: Frontend Polish & UX

### 7.1 UI/UX Improvements
- [ ] **Loading skeletons** สำหรับทุก page
- [ ] **Error boundaries** และ error pages
- [ ] **Toast notifications** system
- [ ] **Confirmation dialogs**
- [ ] **Empty states** handling

### 7.2 Performance Optimization
- [ ] **Image optimization** (Next.js Image)
- [ ] **Code splitting** และ lazy loading  
- [ ] **Bundle size** optimization
- [ ] **Caching strategies**

---

## 🧪 Phase 8: Frontend Testing

### 8.1 Frontend Testing Setup
- [ ] **Jest** configuration
- [ ] **Testing Library** setup
- [ ] **Cypress** E2E testing setup
- [ ] **Mock API** responses

### 8.2 Testing Coverage
- [ ] **Component unit tests**
- [ ] **Page integration tests**
- [ ] **E2E user flows**
- [ ] **Accessibility testing**

---

## 🚀 Phase 9: Frontend Deployment

### 9.1 Frontend Build & Deploy
- [ ] **Production build** configuration
- [ ] **Environment variables** setup
- [ ] **Vercel/Netlify** deployment
- [ ] **Custom domain** setup
- [ ] **SSL certificate** configuration

### 9.2 Frontend Monitoring
- [ ] **Error tracking** (Sentry)
- [ ] **Analytics** integration
- [ ] **Performance monitoring**
- [ ] **Uptime monitoring**

---

## 📈 Progress Tracking

### ✅ Completed Tasks
- [x] **Requirements analysis** และ architecture design
- [x] **Project planning** และ documentation
- [x] **Technology stack** selection
- [x] **🆕 Store Product Creation** feature specification
- [x] **Backend & Frontend** separation planning

### 🔄 Current Sprint: Setup Phase
**Backend**: เริ่มตั้งโปรเจกต์ NestJS + Database schema  
**Frontend**: เริ่มตั้งโปรเจกต์ Next.js + Base components

### 🎯 Next Priority Tasks

#### Backend Priority:
1. สร้างโปรเจกต์ NestJS + Prisma setup
2. Database schema และ migrations
3. Authentication module (JWT + OTP)
4. Basic CRUD APIs (stores, brands, products)

#### Frontend Priority:
1. สร้างโปรเจกต์ Next.js + Tailwind setup
2. Authentication pages และ components
3. Admin dashboard layout
4. Store dashboard layout

---

## 📝 Development Notes

### Backend Decisions:
- ✅ **NestJS** Modular Monolith approach
- ✅ **PostgreSQL** เป็น primary database  
- ✅ **Prisma ORM** สำหรับ database access
- ✅ **JWT + OTP** สำหรับ authentication
- ✅ **🆕 Store Product Creation** workflow with approval queue

### Frontend Decisions:
- ✅ **Next.js App Router** สำหรับ modern React
- ✅ **Tailwind CSS** สำหรับ styling
- ✅ **TypeScript** strict mode
- ✅ **Separate dashboards** สำหรับ admin และ store
- ✅ **SSR/ISR** สำหรับ public storefront

### Pending Decisions:
- 🔄 **UI Library**: shadcn/ui vs Ant Design vs Material-UI
- 🔄 **State Management**: Zustand vs Redux Toolkit
- 🔄 **File storage**: S3-compatible service choice
- 🔄 **Email provider**: สำหรับ OTP และ notifications
- 🔄 **Deployment**: Self-hosted vs Cloud services

### Risk Mitigation:
- ⚠️ **API Design**: Consistent RESTful APIs with proper versioning
- ⚠️ **Authentication**: Secure JWT handling + proper session management
- ⚠️ **Database**: Multi-tenant isolation + proper indexing
- ⚠️ **🆕 Store Product Quality**: Approval workflow + validation rules
- ⚠️ **Performance**: Proper caching strategy + CDN usage

---

## 🔗 Project Communication

### API Communication:
- **Backend URL**: `https://api.yourcompany.com`
- **Admin Frontend**: `https://app.yourcompany.com/admin`
- **Store Frontend**: `https://app.yourcompany.com/store`  
- **Storefront**: `https://shop.yourcompany.com/{storeSlug}`

### Development Workflow:
1. **Backend Team**: Focus on API development + database design
2. **Frontend Team**: Focus on UI/UX + API integration
3. **Integration**: Regular API testing + documentation sync
4. **Deployment**: Separate deployment pipelines for backend/frontend

---

*Last Updated: 2025-09-07*  
*Status: Project Separated - Ready for Independent Development*