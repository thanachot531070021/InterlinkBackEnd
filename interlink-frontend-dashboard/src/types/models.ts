/**
 * Interlink Data Models
 * TypeScript interfaces for all data models
 */

// ============================================
// Enums
// ============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  STORE_ADMIN = 'STORE_ADMIN',
  STORE_STAFF = 'STORE_STAFF',
  SALE = 'SALE',
  CUSTOMER_GUEST = 'CUSTOMER_GUEST',
}

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum BrandStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// ============================================
// User Models
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  storeId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  store?: Store;
}

// ============================================
// Brand Models
// ============================================

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  status: BrandStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandStats {
  totalProducts: number;
  totalStores: number;
  totalSales: number;
  revenue: number;
}

// ============================================
// Store Models
// ============================================

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  email: string;
  phone: string;
  address: StoreAddress;
  socialLinks?: SocialLinks;
  status: StoreStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  line?: string;
  website?: string;
}

export interface StoreStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  lowStockItems: number;
}

// ============================================
// Product Models
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  category: string;
  brandId: string;
  brand?: Brand;
  images: string[];
  basePrice: number;
  attributes?: Record<string, any>;
  status: ProductStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price?: number;
  attributes?: Record<string, any>;
  isActive: boolean;
}

export interface ProductStats {
  totalStock: number;
  totalSold: number;
  revenue: number;
  stores: number;
}

// ============================================
// Entitlement Models
// ============================================

export interface Entitlement {
  id: string;
  storeId: string;
  brandId: string;
  store?: Store;
  brand?: Brand;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Stock Models
// ============================================

export interface Stock {
  id: string;
  storeId: string;
  productId: string;
  variantId?: string;
  product?: Product;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  reorderLevel?: number;
  updatedAt: string;
}

export interface StockAdjustment {
  stockId: string;
  quantity: number;
  reason: string;
  type: 'INCREASE' | 'DECREASE';
}

// ============================================
// Order Models
// ============================================

export interface Order {
  id: string;
  orderNumber: string;
  storeId: string;
  store?: Store;
  customerId?: string;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  product?: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: StoreAddress;
}

// ============================================
// Statistics Models
// ============================================

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  topProducts: ProductStats[];
  salesChart: ChartData[];
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

// ============================================
// Pagination Models
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
