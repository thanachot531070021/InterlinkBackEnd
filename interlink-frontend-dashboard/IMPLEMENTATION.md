# 🎨 Interlink Frontend Dashboard - Implementation Guide

## 📋 Project Overview

**Interlink Frontend Dashboard** เป็น Web Application สำหรับจัดการระบบ Interlink B2B โดยแบ่งเป็น 2 ส่วนหลัก:
1. **Admin Dashboard** - สำหรับ Super Admin จัดการระบบทั้งหมด
2. **Store Dashboard** - สำหรับ Store Owners จัดการร้านค้าของตัวเอง

---

## 🏗️ Tech Stack

```
Framework: Next.js 15.2 (App Router + TypeScript)
Styling: Tailwind CSS 4.0
UI Components: TailAdmin Template + Custom Components
State Management: Zustand
Form Handling: React Hook Form + Zod
HTTP Client: Axios + TanStack Query
Authentication: NextAuth.js
Charts: ApexCharts + React-ApexCharts
Icons: Built-in SVG icons
```

---

## 📁 Project Structure

```
interlink-frontend-dashboard/
├── app/                          # Next.js App Router
│   ├── (admin)/                 # Admin Dashboard Routes
│   │   ├── admin/
│   │   │   ├── brands/          # 📦 CRUD: Brand Management
│   │   │   ├── stores/          # 🏪 CRUD: Store Management
│   │   │   ├── products/        # 📋 CRUD: Product Management
│   │   │   ├── entitlements/    # 🔗 CRUD: Entitlements
│   │   │   ├── users/           # 👥 CRUD: User Management
│   │   │   └── dashboard/       # 📊 Dashboard Overview
│   │   └── layout.tsx           # Admin Layout
│   ├── (store)/                 # Store Dashboard Routes
│   │   ├── store/
│   │   │   ├── dashboard/       # 📊 Store Overview
│   │   │   ├── products/        # 📦 Products (View/Import)
│   │   │   ├── stock/           # 📊 CRUD: Stock Management
│   │   │   ├── orders/          # 🛒 CRUD: Order Management
│   │   │   └── profile/         # ⚙️ Store Profile
│   │   └── layout.tsx           # Store Layout
│   ├── auth/                    # Authentication Pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                     # API Routes (NextAuth)
│   │   └── auth/[...nextauth]/
│   ├── layout.tsx               # Root Layout
│   └── page.tsx                 # Landing Page
├── components/                   # Reusable Components
│   ├── common/                  # Common UI Components
│   │   ├── DataTable/           # Data Table Component
│   │   ├── FormFields/          # Form Input Components
│   │   ├── Modal/               # Modal Component
│   │   └── Breadcrumb/          # Breadcrumb Navigation
│   ├── admin/                   # Admin-specific Components
│   │   ├── BrandForm/
│   │   ├── StoreForm/
│   │   ├── ProductForm/
│   │   ├── EntitlementForm/
│   │   └── UserForm/
│   ├── store/                   # Store-specific Components
│   │   ├── StockForm/
│   │   ├── OrderTable/
│   │   └── DashboardStats/
│   ├── charts/                  # Chart Components
│   └── layout/                  # Layout Components (from template)
├── lib/                          # Utility Libraries
│   ├── api.ts                   # 🔧 Axios Client Setup
│   ├── auth.ts                  # 🔐 NextAuth Configuration
│   ├── utils.ts                 # Utility Functions
│   ├── validations.ts           # 📝 Zod Validation Schemas
│   └── constants.ts             # Constants
├── stores/                       # Zustand Stores
│   ├── authStore.ts             # Auth State
│   ├── brandStore.ts            # Brand State
│   ├── storeStore.ts            # Store State
│   └── uiStore.ts               # UI State
├── types/                        # TypeScript Types
│   ├── api.ts                   # API Response Types
│   ├── models.ts                # Data Models
│   └── index.ts                 # Type Exports
├── hooks/                        # Custom Hooks
│   ├── useAuth.ts
│   ├── useBrands.ts
│   ├── useStores.ts
│   └── useProducts.ts
└── public/                       # Static Assets
    └── images/
```

---

## 🔧 Core Implementation Details

### 1. API Client Setup (`lib/api.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (Add JWT Token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor (Handle Errors)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - attempt refresh
      // Redirect to login if refresh fails
    }
    return Promise.reject(error);
  }
);
```

### 2. Authentication (`lib/auth.ts`)

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });

        if (response.ok) {
          const data = await response.json();
          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            storeId: data.user.storeId,
            accessToken: data.accessToken
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.storeId = user.storeId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.storeId = token.storeId;
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  }
};
```

---

## 📊 CRUD Implementation Pattern

### Example: Brand Management

#### 1. API Service (`lib/services/brandService.ts`)
```typescript
import { apiClient } from '../api';

export const brandService = {
  // Get all brands
  async getBrands(params?: { search?: string; page?: number; limit?: number }) {
    const response = await apiClient.get('/brands', { params });
    return response.data;
  },

  // Get single brand
  async getBrand(id: string) {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data;
  },

  // Create brand
  async createBrand(data: CreateBrandDto) {
    const response = await apiClient.post('/brands', data);
    return response.data;
  },

  // Update brand
  async updateBrand(id: string, data: UpdateBrandDto) {
    const response = await apiClient.patch(`/brands/${id}`, data);
    return response.data;
  },

  // Delete brand
  async deleteBrand(id: string) {
    const response = await apiClient.delete(`/brands/${id}`);
    return response.data;
  }
};
```

#### 2. Custom Hook (`hooks/useBrands.ts`)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/lib/services/brandService';

export function useBrands() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getBrands()
  });

  const createMutation = useMutation({
    mutationFn: brandService.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      brandService.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: brandService.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  return {
    brands: data?.data || [],
    isLoading,
    error,
    createBrand: createMutation.mutate,
    updateBrand: updateMutation.mutate,
    deleteBrand: deleteMutation.mutate
  };
}
```

#### 3. Page Component (`app/(admin)/admin/brands/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { useBrands } from '@/hooks/useBrands';
import BrandTable from '@/components/admin/BrandTable';
import BrandModal from '@/components/admin/BrandModal';

export default function BrandsPage() {
  const { brands, isLoading, createBrand, updateBrand, deleteBrand } = useBrands();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleCreate = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (selectedBrand) {
      updateBrand({ id: selectedBrand.id, data });
    } else {
      createBrand(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Create Brand
        </button>
      </div>

      <BrandTable
        data={brands}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={deleteBrand}
      />

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand={selectedBrand}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

#### 4. Form Component (`components/admin/BrandForm.tsx`)
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { brandSchema } from '@/lib/validations';

export default function BrandForm({ brand, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: brand || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Brand Name</label>
        <input
          {...register('name')}
          className="w-full border rounded px-3 py-2"
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>

      <div>
        <label>Description</label>
        <textarea
          {...register('description')}
          className="w-full border rounded px-3 py-2"
          rows={4}
        />
        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
      </div>

      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
```

---

## 📝 CRUD Modules to Implement

### 🔐 Admin Dashboard

| Module | Endpoint | Features | Priority |
|--------|----------|----------|----------|
| **Brand Management** | `/admin/brands` | List, Create, Edit, Delete, Search | ⭐⭐⭐ |
| **Store Management** | `/admin/stores` | List, Create, Edit, Delete, Search, Stats | ⭐⭐⭐ |
| **Product Management** | `/admin/products` | List, Create, Edit, Delete, Search, Filters | ⭐⭐⭐ |
| **Entitlements** | `/admin/entitlements` | List, Create, Revoke, Check, Active/Inactive | ⭐⭐ |
| **User Management** | `/admin/users` | List, Create, Edit, Delete, Role Management | ⭐⭐ |

### 🏪 Store Dashboard

| Module | Endpoint | Features | Priority |
|--------|----------|----------|----------|
| **Dashboard Overview** | `/store/dashboard` | Stats, Charts, Recent Orders | ⭐⭐⭐ |
| **Stock Management** | `/store/stock` | List, Update Stock, Adjust, History | ⭐⭐⭐ |
| **Order Management** | `/store/orders` | List, View Details, Update Status, Cancel | ⭐⭐⭐ |
| **Product Import** | `/store/products/import` | Browse Catalog, Import to Store | ⭐⭐ |
| **Store Profile** | `/store/profile` | View, Edit Profile, Settings | ⭐ |

---

## 🎨 UI Components Reference

### From TailAdmin Template
- ✅ Layout (Sidebar, Header, Footer)
- ✅ Dashboard Cards & Stats
- ✅ Tables with Pagination
- ✅ Forms & Input Fields
- ✅ Modals & Dialogs
- ✅ Charts (ApexCharts)
- ✅ Buttons & Badges

### Custom Components Needed
- 📋 DataTable with Sorting & Filtering
- 📝 FormField wrappers with React Hook Form
- 🔍 SearchBar component
- 📊 StatCard component
- 🏷️ StatusBadge component
- 📅 DateRangePicker
- 📸 ImageUpload component

### TailAdmin Components URL
🔗 https://tailadmin.com/components

---

## 🔄 State Management

### Zustand Stores

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// stores/uiStore.ts
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  showModal: (modal: string) => void;
  hideModal: () => void;
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd interlink-frontend-dashboard
npm install
```

### 2. Setup Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📋 Development Checklist

### Phase 1: Setup & Core (Priority 1)
- [x] Copy TailAdmin template
- [x] Install dependencies
- [ ] Setup API client (axios + interceptors)
- [ ] Setup NextAuth.js
- [ ] Create base layouts (Admin & Store)
- [ ] Implement authentication pages

### Phase 2: Admin Dashboard (Priority 2)
- [ ] Brand Management CRUD
- [ ] Store Management CRUD
- [ ] Product Management CRUD
- [ ] Entitlements Management
- [ ] User Management CRUD

### Phase 3: Store Dashboard (Priority 3)
- [ ] Store Dashboard Overview
- [ ] Stock Management CRUD
- [ ] Order Management CRUD
- [ ] Product Import UI
- [ ] Store Profile Management

### Phase 4: Polish & Optimization (Priority 4)
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add toast notifications
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] SEO optimization

---

## 📊 API Endpoints Reference

### Authentication
```
POST   /api/auth/login           # Login
GET    /api/auth/profile         # Get profile
POST   /api/auth/refresh         # Refresh token
```

### Admin - Brands
```
GET    /api/brands               # List brands
POST   /api/brands               # Create brand
GET    /api/brands/:id           # Get brand
PATCH  /api/brands/:id           # Update brand
DELETE /api/brands/:id           # Delete brand
```

### Admin - Stores
```
GET    /api/stores               # List stores
POST   /api/stores               # Create store
GET    /api/stores/:id           # Get store
PATCH  /api/stores/:id           # Update store
DELETE /api/stores/:id           # Delete store
GET    /api/stores/:id/stats     # Get store stats
```

### Admin - Products
```
GET    /api/products             # List products
POST   /api/products             # Create product
GET    /api/products/:id         # Get product
PATCH  /api/products/:id         # Update product
DELETE /api/products/:id         # Delete product
GET    /api/products/search      # Search products
```

### Admin - Entitlements
```
GET    /api/entitlements         # List entitlements
POST   /api/entitlements         # Create entitlement
GET    /api/entitlements/:id     # Get entitlement
PATCH  /api/entitlements/:id     # Update entitlement
DELETE /api/entitlements/:id     # Delete entitlement
```

### Admin - Users
```
GET    /api/users                # List users
POST   /api/users                # Create user
GET    /api/users/:id            # Get user
PUT    /api/users/:id            # Update user
DELETE /api/users/:id            # Delete user
```

### Store - Stock
```
GET    /api/api/stock/store/:storeId                     # List stock
POST   /api/api/stock                                    # Create stock
PUT    /api/api/stock/:stockId                           # Update stock
POST   /api/api/stock/adjust                             # Adjust stock
GET    /api/api/stock/store/:storeId/stats               # Get stats
```

### Store - Orders
```
GET    /api/api/orders/store/:storeId                    # List orders
GET    /api/api/orders/:orderId                          # Get order
PUT    /api/api/orders/:orderId/status                   # Update status
POST   /api/api/orders/:orderId/cancel                   # Cancel order
GET    /api/api/orders/stats                             # Get stats
```

---

## 🎯 Next Steps

1. ✅ Setup project structure
2. ⏳ Implement API client and auth
3. ⏳ Create reusable components
4. ⏳ Build Admin CRUD modules
5. ⏳ Build Store Dashboard
6. ⏳ Testing and optimization

---

*Last Updated: 2025-10-26*
*Frontend Dashboard Version: 1.0.0*
