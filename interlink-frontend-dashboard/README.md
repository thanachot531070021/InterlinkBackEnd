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
| **Brand Management** | List, Create, Edit, Delete, Search | ⏳ To Do |
| **Store Management** | List, Create, Edit, Delete, Stats | ⏳ To Do |
| **Product Management** | List, Create, Edit, Delete, Variants | ⏳ To Do |
| **Entitlements** | Grant/Revoke Permissions | ⏳ To Do |
| **User Management** | List, Create, Edit, Delete, Roles | ⏳ To Do |

### 🏪 Store Dashboard (3 Modules)
| Module | Features | Status |
|--------|----------|--------|
| **Dashboard** | Stats, Charts, Recent Orders | ⏳ To Do |
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

## Components

TailAdmin is a pre-designed starting point for building a web-based dashboard using Next.js and Tailwind CSS. The template includes:

- Sophisticated and accessible sidebar
- Data visualization components
- Profile management and custom 404 page
- Tables and Charts(Line and Bar)
- Authentication forms and input elements
- Alerts, Dropdowns, Modals, Buttons and more
- Can't forget Dark Mode 🕶️

All components are built with React and styled using Tailwind CSS for easy customization.

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
