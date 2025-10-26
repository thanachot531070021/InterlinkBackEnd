/**
 * Zod Validation Schemas
 * Form validation schemas using Zod
 */

import { z } from 'zod';

// ============================================
// Auth Validation Schemas
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// Brand Validation Schemas
// ============================================

export const brandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  isActive: z.boolean().default(true),
});

export type BrandFormData = z.infer<typeof brandSchema>;

// ============================================
// Store Validation Schemas
// ============================================

export const storeAddressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2).default('TH'),
});

export const socialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  line: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export const storeSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().max(1000).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: storeAddressSchema,
  socialLinks: socialLinksSchema.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  isActive: z.boolean().default(true),
});

export type StoreFormData = z.infer<typeof storeSchema>;

// ============================================
// Product Validation Schemas
// ============================================

export const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0).optional(),
  attributes: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(200),
  slug: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().max(2000).optional(),
  category: z.string().min(1, 'Category is required'),
  brandId: z.string().uuid('Invalid brand ID'),
  images: z.array(z.string().url()).max(10, 'Maximum 10 images allowed'),
  basePrice: z.number().min(0, 'Price must be greater than 0'),
  attributes: z.record(z.any()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']).default('ACTIVE'),
  isActive: z.boolean().default(true),
  variants: z.array(productVariantSchema).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ============================================
// Entitlement Validation Schemas
// ============================================

export const entitlementSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  brandId: z.string().uuid('Invalid brand ID'),
  isActive: z.boolean().default(true),
  effectiveFrom: z.string().or(z.date()),
  effectiveTo: z.string().or(z.date()).optional(),
});

export type EntitlementFormData = z.infer<typeof entitlementSchema>;

// ============================================
// User Validation Schemas
// ============================================

export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['ADMIN', 'STORE_ADMIN', 'STORE_STAFF', 'SALE', 'CUSTOMER_GUEST']),
  storeId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userSchema>;

// ============================================
// Stock Validation Schemas
// ============================================

export const stockSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid().optional(),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  reorderLevel: z.number().min(0).optional(),
});

export const stockAdjustmentSchema = z.object({
  stockId: z.string().uuid('Invalid stock ID'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(5, 'Reason is required'),
  type: z.enum(['INCREASE', 'DECREASE']),
});

export type StockFormData = z.infer<typeof stockSchema>;
export type StockAdjustmentFormData = z.infer<typeof stockAdjustmentSchema>;

// ============================================
// Order Validation Schemas
// ============================================

export const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be 0 or greater'),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  address: storeAddressSchema.optional(),
});

export const orderSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  notes: z.string().max(500).optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

// ============================================
// Search & Filter Schemas
// ============================================

export const searchSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SearchParams = z.infer<typeof searchSchema>;
