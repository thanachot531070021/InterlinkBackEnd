# 🚀 Getting Started - Interlink Frontend Dashboard

> **Quick Start Guide สำหรับนักพัฒนา**

---

## 📋 Prerequisites

ก่อนเริ่มต้น ตรวจสอบว่าคุณมีสิ่งต่อไปนี้:

- ✅ **Node.js** 18+ installed ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Git** for version control
- ✅ **Backend API** running on `http://localhost:3001` ([Setup Guide](../interlink-backend/README.md))
- ✅ Code Editor (recommended: VS Code)

---

## 🛠️ Installation

### Step 1: Clone & Navigate
```bash
cd interlink-frontend-dashboard
```

### Step 2: Install Dependencies
```bash
npm install
# หรือ
yarn install
```

**Dependencies ที่จะถูกติดตั้ง:**
- Next.js 15.2+ (React 19)
- TanStack Query (React Query)
- React Hook Form + Zod
- Zustand (State Management)
- Axios (HTTP Client)
- @heroicons/react (Icons)
- Tailwind CSS 4.0

---

## ⚙️ Configuration

### Step 3: Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-in-production

# App Configuration
NEXT_PUBLIC_APP_NAME=Interlink Dashboard
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**สำคัญ:**
- `NEXT_PUBLIC_API_URL` - URL ของ Backend API (ต้องรัน Backend ก่อน!)
- `NEXTAUTH_SECRET` - สร้าง secret key ด้วย: `openssl rand -base64 32`

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

แอพจะรันที่: **http://localhost:3000**

### Production Build
```bash
npm run build
npm run start
```

### Type Checking
```bash
npm run lint
```

---

## 🔐 Login Credentials

### Demo Admin Account
```
Email: admin@interlink.com
Password: Admin@123
Role: ADMIN
```

### Demo Store Owner Account
```
Email: store@interlink.com
Password: Store@123
Role: STORE_ADMIN
```

**หมายเหตุ:** บัญชีนี้ต้องสร้างผ่าน Backend API ก่อน (ดู Backend seeding)

---

## 📂 Project Structure Overview

```
interlink-frontend-dashboard/
├── 📁 app/                    # Next.js App Router
│   ├── (admin)/               # Admin routes (protected)
│   │   └── admin/
│   │       ├── brands/        # ✅ Brand Management
│   │       ├── stores/        # ✅ Store Management
│   │       ├── products/      # ✅ Product Management
│   │       └── page.tsx       # ✅ Dashboard
│   ├── auth/login/            # ✅ Login page
│   ├── layout.tsx             # Root layout
│   └── providers.tsx          # React Query provider
│
├── 📁 components/
│   ├── common/                # ✅ Reusable components
│   │   ├── DataTable.tsx      # Table with pagination
│   │   ├── Modal.tsx          # Modal dialogs
│   │   ├── FormFields.tsx     # Form inputs
│   │   ├── SearchBar.tsx      # Search component
│   │   ├── LoadingSpinner.tsx # Loaders
│   │   └── Badge.tsx          # Status badges
│   └── layout/                # ✅ Layout components
│       ├── Sidebar.tsx        # Navigation
│       ├── Header.tsx         # Top bar
│       └── DefaultLayout.tsx  # Wrapper
│
├── 📁 hooks/                  # ✅ React Query hooks
│   ├── useBrands.ts           # Brand operations
│   ├── useStores.ts           # Store operations
│   ├── useProducts.ts         # Product operations
│   ├── useEntitlements.ts     # Permissions
│   └── useUsers.ts            # User management
│
├── 📁 lib/
│   ├── api.ts                 # ✅ Axios client
│   ├── validations.ts         # ✅ Zod schemas
│   └── services/              # ✅ API services (6 files)
│       ├── authService.ts
│       ├── brandService.ts
│       ├── storeService.ts
│       ├── productService.ts
│       ├── entitlementService.ts
│       └── userService.ts
│
├── 📁 stores/                 # ✅ Zustand stores
│   ├── authStore.ts           # Auth state
│   └── uiStore.ts             # UI state
│
└── 📁 types/
    └── models.ts              # ✅ TypeScript types
```

---

## 🎯 First Steps After Installation

### 1. ตรวจสอบ Backend API
```bash
# ทดสอบว่า Backend API รันอยู่
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

### 2. เข้าสู่หน้า Login
```
http://localhost:3000/auth/login
```

### 3. ทดสอบ Features ที่พร้อมใช้งาน

✅ **Admin Dashboard** (http://localhost:3000/admin)
- Dashboard overview with statistics
- Brand Management (List, Create, Edit, Delete)
- Store Management (List, Create, Edit, Delete)
- Product Management (List, Create, Edit, Delete)

🔄 **Coming Soon**:
- Entitlement Management
- User Management
- Store Dashboard

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to API"
**Solution:**
```bash
# 1. ตรวจสอบว่า Backend รันอยู่
cd ../interlink-backend
npm run start:dev

# 2. ตรวจสอบ .env.local
cat .env.local | grep NEXT_PUBLIC_API_URL
# ต้องเป็น: NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Problem: "Module not found" errors
**Solution:**
```bash
# ลบ node_modules และ reinstall
rm -rf node_modules
npm install
```

### Problem: "Type errors" in IDE
**Solution:**
```bash
# Restart TypeScript server (VS Code)
# Command Palette (Cmd+Shift+P) > TypeScript: Restart TS Server

# หรือรัน type check
npm run lint
```

### Problem: "Hydration errors"
**Solution:**
- ตรวจสอบว่าไม่มีการใช้ `localStorage` ใน Server Components
- ตรวจสอบว่าทุก Client Component มี `'use client'` directive

### Problem: "401 Unauthorized"
**Solution:**
```bash
# 1. ตรวจสอบ localStorage
# เปิด Browser DevTools > Application > Local Storage
# ลบ accessToken และ refreshToken

# 2. Login ใหม่
# http://localhost:3000/auth/login
```

---

## 📚 Learning Resources

### Next.js 15 Documentation
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

### TanStack Query (React Query)
- [Official Docs](https://tanstack.com/query/latest)
- [useQuery Hook](https://tanstack.com/query/latest/docs/react/guides/queries)
- [useMutation Hook](https://tanstack.com/query/latest/docs/react/guides/mutations)

### React Hook Form + Zod
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Schema Validation](https://zod.dev/)
- [Integration Guide](https://react-hook-form.com/get-started#SchemaValidation)

### Zustand State Management
- [Getting Started](https://zustand-demo.pmnd.rs/)
- [TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)

### TailAdmin Template
- [Components Library](https://tailadmin.com/components)
- [Documentation](https://tailadmin.com/docs)

---

## 🎨 Development Workflow

### 1. สร้าง Feature ใหม่

```bash
# 1. สร้าง Type (types/models.ts)
export interface NewFeature {
  id: string;
  name: string;
  // ...
}

# 2. สร้าง Validation (lib/validations.ts)
export const newFeatureSchema = z.object({
  name: z.string().min(2),
  // ...
});

# 3. สร้าง Service (lib/services/newFeatureService.ts)
export const newFeatureService = {
  getAll: () => api.get('/features'),
  // ...
};

# 4. สร้าง Hook (hooks/useNewFeature.ts)
export function useNewFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: () => newFeatureService.getAll(),
  });
}

# 5. สร้าง Page (app/(admin)/admin/features/page.tsx)
export default function FeaturesPage() {
  const { data } = useNewFeatures();
  // ...
}
```

### 2. ทดสอบ Component

```bash
# รัน dev server
npm run dev

# เปิด browser
http://localhost:3000/admin/features

# ตรวจสอบ Network tab (DevTools)
# ตรวจสอบ Console logs
# ตรวจสอบ React Query DevTools
```

### 3. Debugging Tips

```typescript
// เปิด React Query DevTools
// app/providers.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables (Production)
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-strong-secret>
```

### Deployment Options
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Docker** (see Dockerfile)
- **VPS** (nginx + PM2)

---

## 📞 Support & Help

### Documentation
- 📖 [README.md](./README.md) - Project overview
- 📊 [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Progress tracking
- 📋 [CRUD_SUMMARY.md](./CRUD_SUMMARY.md) - CRUD modules guide

### Issues
If you encounter any problems:
1. Check [Troubleshooting](#troubleshooting) section
2. Search existing issues in project repository
3. Create new issue with detailed information

### Resources
- Backend API Swagger: http://localhost:3001/api/docs
- TailAdmin Docs: https://tailadmin.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Ready to Code!** 🚀

Happy Coding! If you have questions, refer to the documentation or ask your team lead.
