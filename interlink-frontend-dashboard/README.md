# 🎨 Interlink Frontend Dashboard

> **Web Application สำหรับจัดการระบบ Interlink B2B E-commerce**
>
> Based on TailAdmin Next.js Template + Custom Business Logic

---

## 📋 Overview

Interlink Frontend Dashboard เป็น Web Application ที่พัฒนาด้วย Next.js 15 สำหรับจัดการระบบ B2B E-commerce โดยแบ่งออกเป็น 2 ส่วนหลัก:

1. **🔐 Admin Dashboard** - สำหรับ Super Admin จัดการระบบทั้งหมด
2. **🏪 Store Dashboard** - สำหรับ Store Owners จัดการร้านค้า

### 🚀 Tech Stack
- **Framework**: Next.js 15.2 + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.0
- **UI**: TailAdmin Template
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios + TanStack Query
- **Auth**: NextAuth.js
- **Charts**: ApexCharts

## 📊 Features Overview

### 🔐 Admin Dashboard (5 CRUD Modules)
| Module | Features | Status |
|--------|----------|--------|
| **Brand Management** | List, Create, Edit, Delete, Search | ✅ **COMPLETED** |
| **Store Management** | List, Create, Edit, Delete, Stats | ✅ **COMPLETED** |
| **Product Management** | List, Create, Edit, Delete, Variants | ✅ **COMPLETED** |
| **Entitlements** | Grant/Revoke Permissions | ⏳ To Do |
| **User Management** | List, Create, Edit, Delete, Roles | ⏳ To Do |

### 🏪 Store Dashboard (3 Modules)
| Module | Features | Status |
|--------|----------|--------|
| **Dashboard Overview** | Stats, Charts, Quick Actions | ✅ **COMPLETED** |
| **Stock Management** | View, Update, Adjust Stock | ⏳ To Do |
| **Order Management** | View, Update Status, Cancel | ⏳ To Do |

### 📚 Documentation
- 📖 [IMPLEMENTATION.md](./IMPLEMENTATION.md) - รายละเอียดการพัฒนา
- 📋 [CRUD_SUMMARY.md](./CRUD_SUMMARY.md) - สรุป CRUD ทั้งหมด
- 🔗 [Backend API Docs](http://localhost:3001/api/docs) - Swagger
- 🎨 [TailAdmin Components](https://tailadmin.com/components)

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:3001`

### 2. Install Dependencies
```bash
cd interlink-frontend-dashboard
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local:
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_SECRET=your-secret-key
```

### 4. Run Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์: http://localhost:3000

### 5. Build for Production
```bash
npm run build
npm run start
```

## 📦 Project Structure

```
interlink-frontend-dashboard/
├── app/
│   ├── (admin)/                 # Admin routes (protected)
│   │   ├── admin/
│   │   │   ├── brands/          # ✅ Brand Management CRUD
│   │   │   ├── stores/          # ✅ Store Management CRUD
│   │   │   ├── products/        # ✅ Product Management CRUD
│   │   │   └── page.tsx         # ✅ Dashboard Overview
│   │   └── layout.tsx           # Admin layout wrapper
│   ├── auth/
│   │   └── login/               # ✅ Login page
│   ├── layout.tsx               # Root layout
│   └── providers.tsx            # React Query provider
├── components/
│   ├── common/                  # ✅ Reusable components
│   │   ├── DataTable.tsx        # Table with sorting/pagination
│   │   ├── Modal.tsx            # Dialog components
│   │   ├── FormFields.tsx       # Form inputs
│   │   ├── SearchBar.tsx        # Search with debounce
│   │   ├── LoadingSpinner.tsx   # Loading states
│   │   └── Badge.tsx            # Status badges
│   └── layout/                  # ✅ Layout components
│       ├── Sidebar.tsx          # Navigation sidebar
│       ├── Header.tsx           # Top header
│       └── DefaultLayout.tsx    # Layout wrapper
├── hooks/                       # ✅ Custom React Query hooks
│   ├── useBrands.ts             # Brand operations (8 hooks)
│   ├── useStores.ts             # Store operations (8 hooks)
│   ├── useProducts.ts           # Product operations (13 hooks)
│   ├── useEntitlements.ts       # Permission management (11 hooks)
│   └── useUsers.ts              # User management (8 hooks)
├── lib/
│   ├── api.ts                   # ✅ Axios client with interceptors
│   ├── validations.ts           # ✅ Zod validation schemas
│   └── services/                # ✅ API service layer (6 services)
│       ├── authService.ts
│       ├── brandService.ts
│       ├── storeService.ts
│       ├── productService.ts
│       ├── entitlementService.ts
│       └── userService.ts
├── stores/                      # ✅ Zustand state management
│   ├── authStore.ts             # Authentication state
│   └── uiStore.ts               # UI state (sidebar, modals)
├── types/
│   └── models.ts                # ✅ TypeScript interfaces
└── .env.local                   # Environment variables
```

## ✅ Implementation Progress

### Phase 1: Core Infrastructure (100% Complete)
- ✅ TypeScript Types & Interfaces
- ✅ API Services (6 files, 50+ methods)
- ✅ Zod Validation Schemas (10+ schemas)
- ✅ Zustand Stores (Auth + UI)
- ✅ Axios Client with JWT handling

### Phase 2: Custom Hooks (100% Complete)
- ✅ 48 React Query hooks total
- ✅ Automatic cache invalidation
- ✅ Optimistic updates
- ✅ Error handling with notifications

### Phase 3: Common Components (100% Complete)
- ✅ DataTable with sorting & pagination
- ✅ Modal & ConfirmDialog
- ✅ Form components (Input, Select, Textarea, etc.)
- ✅ SearchBar with debounce
- ✅ Loading & Skeleton loaders
- ✅ Badge & Status indicators

### Phase 4: Layout & Authentication (100% Complete)
- ✅ Sidebar navigation with role-based menu
- ✅ Header with notifications & user menu
- ✅ Login page with form validation
- ✅ Dashboard overview with statistics
- ✅ React Query provider setup

### Phase 5: CRUD Pages (60% Complete)
- ✅ **Brand Management** - Full CRUD with modal forms
- ✅ **Store Management** - Full CRUD with address & contact
- ✅ **Product Management** - Full CRUD with image gallery
- ⏳ Entitlement Management (To Do)
- ⏳ User Management (To Do)

## 🎨 Components

All components are built with React + TypeScript and styled using Tailwind CSS:

- ✅ **Sophisticated sidebar** - Collapsible, role-based navigation
- ✅ **Data tables** - Sortable columns, pagination, search
- ✅ **Form elements** - Validated inputs with error display
- ✅ **Modals & dialogs** - Confirmation dialogs, CRUD forms
- ✅ **Notifications** - Toast-style alerts
- ✅ **Dark mode ready** 🕶️ (TailAdmin built-in)

## Feature Comparison

### Free Version
- 1 Unique Dashboard
- 30+ dashboard components
- 50+ UI elements
- Basic Figma design files
- Community support

### Pro Version
- 5 Unique Dashboards: Analytics, Ecommerce, Marketing, CRM, Stocks (more coming soon)
- 400+ dashboard components and UI elements
- Complete Figma design file
- Email support

To learn more about pro version features and pricing, visit our [pricing page](https://tailadmin.com/pricing).

## Changelog

### Version 2.0.2 - [March 25, 2025]

- Upgraded to Next v15.2.3 for [CVE-2025-29927](https://nextjs.org/blog/cve-2025-29927) concerns
- Included overrides vectormap for packages to prevent peer dependency errors during installation.
- Migrated from react-flatpickr to flatpickr package for React 19 support

### Version 2.0.1 - [February 27, 2025]

#### Update Overview

- Upgraded to Tailwind CSS v4 for better performance and efficiency.
- Updated class usage to match the latest syntax and features.
- Replaced deprecated class and optimized styles.

#### Next Steps

- Run npm install or yarn install to update dependencies.
- Check for any style changes or compatibility issues.
- Refer to the Tailwind CSS v4 [Migration Guide](https://tailwindcss.com/docs/upgrade-guide) on this release. if needed.
- This update keeps the project up to date with the latest Tailwind improvements. 🚀

### v2.0.0 (February 2025)
A major update focused on Next.js 15 implementation and comprehensive redesign.

#### Major Improvements
- Complete redesign using Next.js 15 App Router and React Server Components
- Enhanced user interface with Next.js-optimized components
- Improved responsiveness and accessibility
- New features including collapsible sidebar, chat screens, and calendar
- Redesigned authentication using Next.js App Router and server actions
- Updated data visualization using ApexCharts for React

#### Breaking Changes

- Migrated from Next.js 14 to Next.js 15
- Chart components now use ApexCharts for React
- Authentication flow updated to use Server Actions and middleware

[Read more](https://tailadmin.com/docs/update-logs/nextjs) on this release.

#### Breaking Changes
- Migrated from Next.js 14 to Next.js 15
- Chart components now use ApexCharts for React
- Authentication flow updated to use Server Actions and middleware

### v1.3.4 (July 01, 2024)
- Fixed JSvectormap rendering issues

### v1.3.3 (June 20, 2024)
- Fixed build error related to Loader component

### v1.3.2 (June 19, 2024)
- Added ClickOutside component for dropdown menus
- Refactored sidebar components
- Updated Jsvectormap package

### v1.3.1 (Feb 12, 2024)
- Fixed layout naming consistency
- Updated styles

### v1.3.0 (Feb 05, 2024)
- Upgraded to Next.js 14
- Added Flatpickr integration
- Improved form elements
- Enhanced multiselect functionality
- Added default layout component

## License

TailAdmin Next.js Free Version is released under the MIT License.

## Support

If you find this project helpful, please consider giving it a star on GitHub. Your support helps us continue developing and maintaining this template.
