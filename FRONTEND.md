# 🎨 Interlink Frontend Web Applications

## 📋 โปรเจกต์ Frontend Overview

**Interlink Frontend** เป็น Web Applications ที่ให้บริการ UI/UX สำหรับระบบจัดการร้านค้าและสินค้าแบบ B2B โดยแยกเป็น 3 ส่วนหลัก

### 🎯 Applications
1. **Admin Dashboard** (`/admin/*`) - จัดการระบบโดย Super Admin
2. **Store Dashboard** (`/store/*`) - จัดการร้านค้าโดย Store owners  
3. **Public Storefront** (`/shop/{storeSlug}/*`) - หน้าร้านสำหรับลูกค้า

---

## 🏗️ Frontend Architecture

### Tech Stack
```
Framework: Next.js 14 (App Router + TypeScript)
Styling: Tailwind CSS + shadcn/ui
State Management: Zustand (or Redux Toolkit)
Form Handling: React Hook Form + Zod validation
HTTP Client: Axios + TanStack Query
Authentication: NextAuth.js + JWT
Charts: Recharts
Testing: Jest + Testing Library + Cypress
Build Tools: Next.js built-in (Turbopack)
```

### Project Structure
```
src/
├── app/                     # Next.js App Router pages
│   ├── admin/              # Admin Dashboard pages
│   ├── store/              # Store Dashboard pages  
│   ├── shop/[storeSlug]/   # Dynamic Storefront pages
│   ├── auth/               # Authentication pages
│   └── api/                # API routes (optional)
├── components/              # Reusable UI components
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── forms/              # Form components
│   ├── charts/             # Chart components
│   └── layouts/            # Layout components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
│   ├── api.ts              # API client setup
│   ├── auth.ts             # Authentication utilities
│   ├── utils.ts            # General utilities
│   └── validations.ts      # Zod schemas
├── stores/                  # Zustand stores (or Redux slices)
├── types/                   # TypeScript type definitions
└── styles/                  # Global styles
```

---

## 🔐 Authentication System

### NextAuth.js Configuration
```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Call backend /auth/login API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        
        if (response.ok) {
          const user = await response.json();
          return user; // { id, email, role, storeId?, accessToken, refreshToken }
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.storeId = user.storeId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.storeId = token.storeId;
      return session;
    }
  }
};
```

### Protected Routes
```typescript
// components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <LoadingSpinner />;
  
  if (!session) {
    redirect('/auth/login');
    return null;
  }
  
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return <UnauthorizedPage />;
  }
  
  return <>{children}</>;
}
```

### OTP Verification Flow
```typescript
// components/auth/OTPVerification.tsx
export function OTPVerification({ email }: { email: string }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const otpCode = otp.join('');
      const response = await api.post('/auth/otp/verify', { email, otp: otpCode });
      
      if (response.data.success) {
        // Sign in with NextAuth
        await signIn('credentials', {
          email,
          accessToken: response.data.accessToken,
          callbackUrl: getRedirectUrl(response.data.user.role)
        });
      }
    } catch (error) {
      toast.error('Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <OTPInput value={otp} onChange={setOtp} />
      <Button onClick={handleVerify} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
      </Button>
    </div>
  );
}
```

---

## 🏪 Admin Dashboard

### Admin Layout
```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

### Admin Navigation
```typescript
// components/admin/AdminSidebar.tsx
const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/brands', label: 'Brands', icon: Tag },
  { href: '/admin/stores', label: 'Stores', icon: Store },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/users', label: 'Users', icon: Users },
  // 🆕 Store Product Creation Management
  { 
    label: 'Store Products',
    icon: Wrench,
    children: [
      { href: '/admin/store-products/permissions', label: 'Permissions' },
      { href: '/admin/store-products/approvals', label: 'Approval Queue' },
      { href: '/admin/store-products/analytics', label: 'Analytics' }
    ]
  },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings }
];
```

### Brand Management
```typescript
// app/admin/brands/page.tsx
export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: brandsData, isLoading } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => api.get('/admin/brands').then(res => res.data)
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Brand Management</h1>
        <Button onClick={() => router.push('/admin/brands/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Brand
        </Button>
      </div>
      
      <BrandsTable 
        data={brandsData?.data || []} 
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

### 🆕 Store Product Permissions Management
```typescript
// app/admin/store-products/permissions/page.tsx
export default function StoreProductPermissionsPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [permissions, setPermissions] = useState<StoreProductPermission[]>([]);
  
  const handleUpdatePermissions = async (storeId: string, data: PermissionUpdateDto) => {
    try {
      await api.put(`/admin/stores/${storeId}/product-permissions`, data);
      toast.success('Permissions updated successfully');
      // Refresh data
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Store</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreSelector 
            selectedStore={selectedStore}
            onSelect={setSelectedStore}
          />
        </CardContent>
      </Card>
      
      {selectedStore && (
        <Card>
          <CardHeader>
            <CardTitle>Product Creation Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductPermissionForm
              storeId={selectedStore.id}
              initialData={permissions}
              onSubmit={handleUpdatePermissions}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

### 🆕 Product Approval Queue
```typescript
// app/admin/store-products/approvals/page.tsx
export default function ProductApprovalsPage() {
  const { data: approvals, refetch } = useQuery({
    queryKey: ['product-approvals'],
    queryFn: () => api.get('/admin/product-approvals').then(res => res.data)
  });
  
  const handleApprove = async (approvalId: string) => {
    try {
      await api.put(`/admin/product-approvals/${approvalId}/approve`);
      toast.success('Product approved successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to approve product');
    }
  };
  
  const handleReject = async (approvalId: string, reason: string) => {
    try {
      await api.put(`/admin/product-approvals/${approvalId}/reject`, { reason });
      toast.success('Product rejected');
      refetch();
    } catch (error) {
      toast.error('Failed to reject product');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Approval Queue</h1>
        <div className="flex gap-2">
          <ApprovalFilters />
          <Badge variant="secondary">
            {approvals?.data?.filter(a => a.status === 'PENDING').length || 0} Pending
          </Badge>
        </div>
      </div>
      
      <ProductApprovalTable
        data={approvals?.data || []}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestRevision={handleRequestRevision}
      />
    </div>
  );
}
```

---

## 🏬 Store Dashboard

### Store Layout
```typescript
// app/store/layout.tsx
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.STORE_ADMIN, UserRole.STORE_STAFF]}>
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <StoreHeader />
          <main className="flex-1 p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

### Store Navigation
```typescript
// components/store/StoreSidebar.tsx
const storeNavItems = [
  { href: '/store', label: 'Dashboard', icon: Home },
  { href: '/store/profile', label: 'Store Profile', icon: Store },
  { 
    label: 'Products',
    icon: Package,
    children: [
      { href: '/store/products', label: 'My Products' },
      { href: '/store/products/import', label: 'Import Products' },
      { href: '/store/products/create', label: '🆕 Create Product' }  // New!
    ]
  },
  { href: '/store/stock', label: 'Stock Management', icon: Boxes },
  { href: '/store/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/store/reports', label: 'Reports', icon: BarChart3 },
  { href: '/store/subscription', label: 'Subscription', icon: CreditCard }
];
```

### 🆕 Store Product Creation
```typescript
// app/store/products/create/page.tsx
export default function CreateProductPage() {
  const { data: permissions } = useQuery({
    queryKey: ['store-product-permissions'],
    queryFn: () => api.get('/store/product-permissions').then(res => res.data)
  });
  
  const { data: eligibility } = useQuery({
    queryKey: ['product-creation-eligibility'],
    queryFn: () => api.get('/store/products/create-eligibility').then(res => res.data)
  });
  
  if (!permissions?.canCreateProducts) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Creation Not Allowed</h2>
          <p className="text-gray-600">
            Your store doesn't have permission to create custom products. 
            Contact admin for more information.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Product</h1>
        <ProductCreationQuota 
          used={eligibility?.productsThisMonth || 0}
          limit={permissions?.maxProductsPerMonth}
        />
      </div>
      
      <ProductCreationForm 
        permissions={permissions}
        onSubmit={handleSubmitProduct}
      />
    </div>
  );
}
```

### Product Creation Form
```typescript
// components/store/ProductCreationForm.tsx
const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  brandId: z.string().uuid(),
  category: z.string(),
  price: z.number().min(0),
  variants: z.array(z.object({
    name: z.string(),
    sku: z.string(),
    price: z.number().optional()
  })).optional(),
  images: z.array(z.string()).max(5)
});

export function ProductCreationForm({ permissions, onSubmit }: ProductCreationFormProps) {
  const form = useForm<ProductCreateDto>({
    resolver: zodResolver(productSchema)
  });
  
  const handleSubmit = async (data: ProductCreateDto) => {
    try {
      // Validate against permissions
      if (permissions?.allowedCategories && 
          !permissions.allowedCategories.includes(data.category)) {
        toast.error('Category not allowed for your store');
        return;
      }
      
      // Validate pricing rules
      if (permissions?.pricingRules) {
        const isValidPrice = validatePricing(data.price, permissions.pricingRules);
        if (!isValidPrice) {
          toast.error('Price violates store pricing rules');
          return;
        }
      }
      
      await onSubmit(data);
    } catch (error) {
      toast.error('Failed to create product');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter product name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          
          <FormField name="category" render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(permissions?.allowedCategories || []).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        
        {/* Product Images */}
        <ProductImageUpload 
          onImagesChange={handleImagesChange}
          maxImages={5}
        />
        
        {/* Product Variants */}
        <ProductVariantsSection 
          variants={variants}
          onVariantsChange={setVariants}
        />
        
        {/* Submission Notice */}
        {permissions?.requiresApproval && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Approval Required</AlertTitle>
            <AlertDescription>
              This product will be submitted for admin approval before it becomes available for sale.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">
            {permissions?.requiresApproval ? 'Submit for Approval' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### Product Submissions Tracking
```typescript
// app/store/products/submissions/page.tsx
export default function ProductSubmissionsPage() {
  const { data: submissions } = useQuery({
    queryKey: ['product-submissions'],
    queryFn: () => api.get('/store/product-submissions').then(res => res.data)
  });
  
  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'destructive',
      REVISION_REQUIRED: 'secondary'
    };
    
    return <Badge variant={variants[status] as any}>{status}</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Product Submissions</h1>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions?.data?.map(submission => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  {submission.productData.name}
                </TableCell>
                <TableCell>{submission.brand.name}</TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {submission.status === 'REVISION_REQUIRED' && (
                      <Button size="sm">
                        Edit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

---

## 🛒 Public Storefront

### Dynamic Store Routes
```typescript
// app/shop/[storeSlug]/layout.tsx
export default async function StorefrontLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { storeSlug: string };
}) {
  const store = await getStoreBySlug(params.storeSlug);
  
  if (!store || store.status !== 'ACTIVE') {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      <StorefrontHeader store={store} />
      <main>
        {children}
      </main>
      <StorefrontFooter store={store} />
    </div>
  );
}
```

### Product Catalog (SSR)
```typescript
// app/shop/[storeSlug]/page.tsx
export default async function StorefrontPage({
  params,
  searchParams
}: {
  params: { storeSlug: string };
  searchParams: { category?: string; search?: string; page?: string };
}) {
  const store = await getStoreBySlug(params.storeSlug);
  const products = await getStoreProducts(store.id, searchParams);
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters categories={store.categories} />
        </div>
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{store.name}</h1>
            <ProductSorting />
          </div>
          
          <ProductGrid products={products} />
          
          <Pagination 
            currentPage={Number(searchParams.page) || 1}
            totalPages={Math.ceil(products.total / 12)}
          />
        </div>
      </div>
    </div>
  );
}

// Generate static paths for popular stores
export async function generateStaticParams() {
  const popularStores = await getPopularStores();
  return popularStores.map(store => ({ storeSlug: store.slug }));
}
```

### Shopping Cart
```typescript
// hooks/useShoppingCart.ts
export function useShoppingCart() {
  const [cart, setCart] = useLocalStorage('shopping-cart', []);
  
  const addToCart = (product: Product, quantity: number = 1, variantId?: string) => {
    const item = {
      id: `${product.id}-${variantId || 'default'}`,
      productId: product.id,
      variantId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]
    };
    
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      if (existingItem) {
        return prevCart.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prevCart, item];
    });
    
    toast.success('Added to cart');
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const removeItem = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  const clearCart = () => setCart([]);
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return { cart, addToCart, updateQuantity, removeItem, clearCart, total };
}
```

### Guest Checkout
```typescript
// app/shop/[storeSlug]/checkout/page.tsx
const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email(),
    address: z.object({
      street: z.string().min(5),
      city: z.string().min(2),
      postalCode: z.string().min(5),
      country: z.string().default('TH')
    })
  }),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().min(1)
  }))
});

export default function CheckoutPage({ params }: { params: { storeSlug: string } }) {
  const { cart, clearCart } = useShoppingCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const form = useForm<CheckoutDto>({
    resolver: zodResolver(checkoutSchema)
  });
  
  const handlePlaceOrder = async (data: CheckoutDto) => {
    setIsPlacingOrder(true);
    try {
      const orderData = {
        ...data,
        items: cart.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        }))
      };
      
      const response = await api.post('/public/orders', orderData);
      
      if (response.data.success) {
        clearCart();
        router.push(`/shop/${params.storeSlug}/order-confirmation/${response.data.order.id}`);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Some items are out of stock. Please check your cart.');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm 
            form={form}
            onSubmit={handlePlaceOrder}
            isLoading={isPlacingOrder}
          />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary items={cart} />
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 State Management

### Zustand Store Example
```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  }))
}));

// stores/cartStore.ts (สำหรับ Storefront)
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, variantId) => {
        // Implementation
      },
      updateQuantity: (itemId, quantity) => {
        // Implementation
      },
      removeItem: (itemId) => {
        // Implementation
      },
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'shopping-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

---

## 🎨 UI Components

### Base Components (shadcn/ui)
```bash
# Install base components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add select
```

### Custom Components
```typescript
// components/ui/DataTable.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
}

export function DataTable<T>({ data, columns, isLoading, ...props }: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // ... other table configuration
  });
  
  if (isLoading) {
    return <TableSkeleton />;
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Table rows implementation */}
          </TableBody>
        </Table>
      </div>
      
      {props.pagination && (
        <DataTablePagination 
          table={table}
          pagination={props.pagination}
          onPaginationChange={props.onPaginationChange}
        />
      )}
    </div>
  );
}
```

### Chart Components
```typescript
// components/charts/SalesChart.tsx
interface SalesChartProps {
  data: SalesData[];
  period: 'daily' | 'weekly' | 'monthly';
}

export function SalesChart({ data, period }: SalesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8884d8" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#82ca9d" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest + Testing Library)
```typescript
// __tests__/components/ProductCreationForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCreationForm } from '@/components/store/ProductCreationForm';

const mockPermissions = {
  canCreateProducts: true,
  requiresApproval: true,
  maxProductsPerMonth: 10,
  allowedCategories: ['Electronics', 'Clothing']
};

describe('ProductCreationForm', () => {
  it('should render form with all required fields', () => {
    render(
      <ProductCreationForm 
        permissions={mockPermissions}
        onSubmit={jest.fn()}
      />
    );
    
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
  });
  
  it('should show approval notice when approval is required', () => {
    render(
      <ProductCreationForm 
        permissions={mockPermissions}
        onSubmit={jest.fn()}
      />
    );
    
    expect(screen.getByText('Approval Required')).toBeInTheDocument();
  });
  
  it('should validate form data before submission', async () => {
    const onSubmit = jest.fn();
    
    render(
      <ProductCreationForm 
        permissions={mockPermissions}
        onSubmit={onSubmit}
      />
    );
    
    fireEvent.click(screen.getByText('Submit for Approval'));
    
    await waitFor(() => {
      expect(screen.getByText('Product name is required')).toBeInTheDocument();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
```

### E2E Tests (Cypress)
```typescript
// cypress/e2e/store-product-creation.cy.ts
describe('Store Product Creation', () => {
  beforeEach(() => {
    // Login as store admin
    cy.login('store-admin@example.com', 'password');
    cy.visit('/store/products/create');
  });
  
  it('should create product successfully', () => {
    // Fill form
    cy.get('[data-testid="product-name"]').type('Test Product');
    cy.get('[data-testid="category-select"]').click();
    cy.get('[data-value="Electronics"]').click();
    cy.get('[data-testid="price"]').type('99.99');
    cy.get('[data-testid="description"]').type('This is a test product description.');
    
    // Upload image
    cy.get('[data-testid="image-upload"]').selectFile('cypress/fixtures/product.jpg');
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify success
    cy.get('[data-testid="toast-success"]').should('contain', 'Product submitted for approval');
    cy.url().should('include', '/store/products/submissions');
  });
  
  it('should prevent creation when quota exceeded', () => {
    // Mock API to return quota exceeded
    cy.intercept('GET', '/api/store/products/create-eligibility', {
      statusCode: 200,
      body: { canCreate: false, reason: 'quota_exceeded' }
    }).as('checkEligibility');
    
    cy.visit('/store/products/create');
    cy.wait('@checkEligibility');
    
    cy.get('[data-testid="quota-warning"]')
      .should('contain', 'Monthly product creation limit reached');
  });
});
```

---

## 🚀 Deployment & Performance

### Next.js Configuration
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true // Use Turbopack for faster builds
  },
  images: {
    domains: ['your-s3-bucket.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif']
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  },
  // Enable SWC minification
  swcMinify: true,
  // Standalone output for Docker
  output: 'standalone'
};

module.exports = nextConfig;
```

### Performance Optimization
```typescript
// components/ProductGrid.tsx
import { lazy, Suspense } from 'react';

const ProductCard = lazy(() => import('./ProductCard'));

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
          <ProductCard product={product} />
        </Suspense>
      ))}
    </div>
  );
}

// Use Next.js Image optimization
import Image from 'next/image';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-2xl font-bold text-primary">
          ฿{product.price.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
```

### Build & Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Environment Variables
```bash
# .env.local
NEXTAUTH_URL=https://app.yourcompany.com
NEXTAUTH_SECRET=your-nextauth-secret

NEXT_PUBLIC_API_URL=https://api.yourcompany.com
NEXT_PUBLIC_APP_URL=https://app.yourcompany.com

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=GA_TRACKING_ID
```

---

*Last Updated: 2025-09-07*  
*Frontend Version: 1.0.0*