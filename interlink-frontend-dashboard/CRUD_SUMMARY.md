# 📋 Interlink Frontend Dashboard - CRUD Summary

## 📊 สรุประบบ CRUD ทั้งหมดที่ต้องพัฒนา

---

## 🔐 ADMIN DASHBOARD - 5 Modules (High Priority)

### 1. 🏷️ **Brand Management** (CRUD)

#### API Endpoints:
```
GET    /api/brands                    # List all brands (with pagination, search)
GET    /api/brands/active             # List active brands only
GET    /api/brands/:id                # Get single brand details
POST   /api/brands                    # Create new brand
PATCH  /api/brands/:id                # Update existing brand
DELETE /api/brands/:id                # Delete brand
GET    /api/brands/:id/stats          # Get brand statistics
```

#### Features:
- ✅ View list of all brands with pagination
- ✅ Search brands by name
- ✅ Filter brands by status (Active/Inactive)
- ✅ Create new brand (name, description, logo)
- ✅ Edit brand information
- ✅ Delete brand (with confirmation)
- ✅ View brand statistics (products, stores selling)

#### UI Components Needed:
- `BrandTable` - Data table with sorting/filtering
- `BrandForm` - Create/Edit form with validation
- `BrandModal` - Modal dialog for form
- `BrandCard` - Brand info card for stats
- `DeleteConfirmDialog` - Confirmation dialog

---

### 2. 🏪 **Store Management** (CRUD)

#### API Endpoints:
```
GET    /api/stores                    # List all stores
GET    /api/stores/active             # List active stores
GET    /api/stores/:id                # Get single store
GET    /api/stores/:id/stats          # Get store statistics
GET    /api/stores/:id/brands         # Get brands authorized for store
POST   /api/stores                    # Create new store
PATCH  /api/stores/:id                # Update store
DELETE /api/stores/:id                # Delete store
```

#### Features:
- ✅ View list of all stores
- ✅ Search stores by name
- ✅ Filter stores by status
- ✅ Create new store (name, contact, address)
- ✅ Edit store information
- ✅ Delete store
- ✅ View store statistics
- ✅ View brands authorized for each store

#### UI Components Needed:
- `StoreTable` - Data table
- `StoreForm` - Create/Edit form
- `StoreModal` - Form modal
- `StoreDetailCard` - Store details
- `StoreStats` - Statistics dashboard

---

### 3. 📦 **Product Management** (CRUD)

#### API Endpoints:
```
GET    /api/products                  # List all products
GET    /api/products/search           # Search products
GET    /api/products/active           # List active products
GET    /api/products/brand/:brandId   # Products by brand
GET    /api/products/:id              # Get product details
GET    /api/products/:id/stats        # Get product statistics
POST   /api/products                  # Create new product
PATCH  /api/products/:id              # Update product
DELETE /api/products/:id              # Delete product
```

#### Features:
- ✅ View list of all products
- ✅ Search products by name/SKU
- ✅ Filter products by brand, category, status
- ✅ Create new product with variants
- ✅ Edit product information
- ✅ Delete product
- ✅ Upload product images
- ✅ View product statistics

#### UI Components Needed:
- `ProductTable` - Data table with filters
- `ProductForm` - Complex form with variants
- `ProductModal` - Form modal
- `ImageUpload` - Image upload component
- `VariantEditor` - Product variants editor
- `ProductStats` - Statistics card

---

### 4. 🔗 **Store-Brand Entitlements** (CRUD)

#### API Endpoints:
```
GET    /api/entitlements                           # List all entitlements
GET    /api/entitlements/active                    # List active entitlements
GET    /api/entitlements/store/:storeId            # Get store's entitlements
GET    /api/entitlements/brand/:brandId            # Get brand's entitlements
GET    /api/entitlements/check/:storeId/:brandId   # Check if store has permission
GET    /api/entitlements/:id                       # Get entitlement details
POST   /api/entitlements                           # Create new entitlement
PATCH  /api/entitlements/:id                       # Update entitlement
PATCH  /api/entitlements/:id/revoke                # Revoke entitlement
DELETE /api/entitlements/:id                       # Delete entitlement
```

#### Features:
- ✅ View list of all entitlements
- ✅ Filter by store or brand
- ✅ Create new entitlement (grant permission)
- ✅ Update entitlement details
- ✅ Revoke entitlement
- ✅ Check permission status
- ✅ View entitlement history

#### UI Components Needed:
- `EntitlementTable` - Data table
- `EntitlementForm` - Create/Edit form
- `EntitlementModal` - Form modal
- `StoreSelector` - Store selection dropdown
- `BrandSelector` - Brand selection dropdown
- `PermissionBadge` - Status badge

---

### 5. 👥 **User Management** (CRUD)

#### API Endpoints:
```
GET    /api/users                     # List all users
GET    /api/users/search              # Search users
GET    /api/users/stats               # Get user statistics
GET    /api/users/store/:storeId      # Users by store
GET    /api/users/:id                 # Get user details
POST   /api/users                     # Create new user
PUT    /api/users/:id                 # Update user
DELETE /api/users/:id                 # Delete user
```

#### Features:
- ✅ View list of all users
- ✅ Search users by email/name
- ✅ Filter users by role, store
- ✅ Create new user with role assignment
- ✅ Edit user information
- ✅ Delete user
- ✅ Reset user password
- ✅ View user statistics

#### UI Components Needed:
- `UserTable` - Data table
- `UserForm` - Create/Edit form
- `UserModal` - Form modal
- `RoleSelector` - Role dropdown
- `UserStats` - Statistics dashboard
- `PasswordResetDialog` - Password reset

---

## 🏪 STORE DASHBOARD - 3 Modules (High Priority)

### 6. 📊 **Stock Management** (CRUD)

#### API Endpoints:
```
GET    /api/api/stock/store/:storeId                         # List store stock
GET    /api/api/stock/store/:storeId/product/:productId      # Get product stock
GET    /api/api/stock/store/:storeId/stats                   # Get stock statistics
POST   /api/api/stock                                        # Create stock entry
PUT    /api/api/stock/:stockId                               # Update stock
POST   /api/api/stock/adjust                                 # Adjust stock (add/remove)
POST   /api/api/stock/reserve                                # Reserve stock
POST   /api/api/stock/release-reservation                    # Release reservation
```

#### Features:
- ✅ View current stock levels
- ✅ Search products in stock
- ✅ Filter by category, brand
- ✅ Add new product to stock
- ✅ Update stock quantity
- ✅ Adjust stock (manual increase/decrease)
- ✅ View stock movement history
- ✅ Low stock alerts
- ✅ Stock statistics

#### UI Components Needed:
- `StockTable` - Data table with stock levels
- `StockForm` - Add/Update form
- `StockAdjustmentModal` - Adjustment dialog
- `StockStats` - Statistics cards
- `LowStockAlert` - Alert component
- `StockHistory` - History timeline

---

### 7. 🛒 **Order Management** (CRUD)

#### API Endpoints:
```
GET    /api/api/orders/store/:storeId                        # List store orders
GET    /api/api/orders/:orderId                              # Get order details
GET    /api/api/orders/search                                # Search orders
GET    /api/api/orders/stats                                 # Get order statistics
GET    /api/api/orders/attention                             # Orders needing attention
PUT    /api/api/orders/:orderId/status                       # Update order status
POST   /api/api/orders/:orderId/cancel                       # Cancel order
POST   /api/api/orders                                       # Create order (for manual entry)
```

#### Features:
- ✅ View list of all orders
- ✅ Search orders by order number/customer
- ✅ Filter orders by status, date range
- ✅ View order details
- ✅ Update order status
- ✅ Cancel order
- ✅ Print order invoice
- ✅ View order statistics
- ✅ Orders requiring attention

#### UI Components Needed:
- `OrderTable` - Data table with status
- `OrderDetailModal` - Order details view
- `OrderStatusSelector` - Status dropdown
- `OrderStats` - Statistics dashboard
- `OrderTimeline` - Status history timeline
- `InvoicePrint` - Print invoice component

---

### 8. 📦 **Store Dashboard Overview**

#### API Endpoints:
```
GET    /api/api/orders/stats                                 # Order statistics
GET    /api/api/stock/store/:storeId/stats                   # Stock statistics
GET    /api/stores/:id/stats                                 # Store statistics
```

#### Features:
- ✅ Summary cards (Total Orders, Revenue, Products, Stock Value)
- ✅ Recent orders list
- ✅ Low stock alerts
- ✅ Sales chart (daily/weekly/monthly)
- ✅ Top selling products
- ✅ Order status distribution

#### UI Components Needed:
- `StatCard` - Summary statistics card
- `SalesChart` - Line/Bar chart
- `RecentOrdersList` - Recent orders table
- `TopProductsChart` - Top products chart
- `LowStockWidget` - Low stock widget
- `OrderStatusChart` - Pie chart

---

## 📝 Additional Features (Medium Priority)

### 9. **Product Import** (Store)
- Browse central product catalog
- Import products to store
- Set store-specific pricing

### 10. **Store Profile** (Store)
- View store information
- Edit store details
- Update contact information
- Upload store logo

---

## 🎯 Implementation Priority

### Phase 1: Core Setup (Week 1)
1. ✅ Setup project and dependencies
2. ⏳ API Client & Auth utilities
3. ⏳ Layout components
4. ⏳ Authentication pages

### Phase 2: Admin Dashboard (Week 2-3)
5. ⏳ Brand Management CRUD
6. ⏳ Store Management CRUD
7. ⏳ Product Management CRUD
8. ⏳ Entitlements Management
9. ⏳ User Management CRUD

### Phase 3: Store Dashboard (Week 4)
10. ⏳ Store Dashboard Overview
11. ⏳ Stock Management CRUD
12. ⏳ Order Management CRUD

### Phase 4: Polish & Testing (Week 5)
13. ⏳ UI/UX improvements
14. ⏳ Error handling & validation
15. ⏳ Performance optimization
16. ⏳ Testing & bug fixes

---

## 📊 CRUD Operation Summary

| Module | Create | Read | Update | Delete | Search | Filter | Stats | Export |
|--------|--------|------|--------|--------|--------|--------|-------|--------|
| **Brands** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| **Stores** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| **Products** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| **Entitlements** | ✅ | ✅ | ✅ | ✅ | - | ✅ | ✅ | - |
| **Users** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| **Stock** | ✅ | ✅ | ✅ | - | ✅ | ✅ | ✅ | ✅ |
| **Orders** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔑 Key Technical Requirements

### Form Validation
- ✅ Use React Hook Form + Zod
- ✅ Real-time validation
- ✅ Clear error messages
- ✅ Field-level validation

### Data Fetching
- ✅ Use TanStack Query (React Query)
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates

### State Management
- ✅ Use Zustand for global state
- ✅ Auth state
- ✅ UI state (modals, sidebar)
- ✅ Form state (React Hook Form)

### UI/UX
- ✅ Loading states (skeleton screens)
- ✅ Empty states
- ✅ Error states
- ✅ Success notifications (toast)
- ✅ Confirmation dialogs
- ✅ Responsive design

---

## 📦 Reusable Components Library

### Core Components
1. **DataTable** - Sortable, filterable table with pagination
2. **FormField** - Standardized form inputs with validation
3. **Modal** - Reusable modal dialog
4. **SearchBar** - Search input with debounce
5. **FilterPanel** - Filter sidebar/dropdown
6. **StatCard** - Statistics summary card
7. **StatusBadge** - Color-coded status badges
8. **LoadingSpinner** - Loading indicator
9. **EmptyState** - Empty state placeholder
10. **ConfirmDialog** - Confirmation dialog
11. **Toast** - Notification system
12. **Pagination** - Pagination controls

---

## 🚀 Getting Started Checklist

### Backend API Connection
- [ ] Setup environment variables (.env.local)
- [ ] Configure API_BASE_URL
- [ ] Test API connectivity
- [ ] Verify authentication endpoints

### Authentication
- [ ] Setup NextAuth.js
- [ ] Configure credentials provider
- [ ] Test login flow
- [ ] Implement protected routes
- [ ] Handle token refresh

### UI Development
- [ ] Explore TailAdmin components
- [ ] Customize color scheme
- [ ] Create reusable components
- [ ] Setup form validation schemas

### Testing
- [ ] Test all CRUD operations
- [ ] Test form validations
- [ ] Test error handling
- [ ] Test responsive design
- [ ] Browser compatibility testing

---

## 📞 API Backend Status

✅ **All 114 Backend APIs are functional**

- Authentication: 8 endpoints
- Brands: 8 endpoints
- Stores: 9 endpoints
- Products: 12 endpoints
- Entitlements: 13 endpoints
- Users: 9 endpoints
- Stock: 11 endpoints
- Orders: 10 endpoints
- File Upload: 10 endpoints
- Public APIs: 15 endpoints
- 2FA: 6 endpoints
- Social Login: 5 endpoints

**Backend URL**: `http://localhost:3001/api`
**Swagger Docs**: `http://localhost:3001/api/docs`

---

*Last Updated: 2025-10-26*
*Ready to start development! 🚀*
