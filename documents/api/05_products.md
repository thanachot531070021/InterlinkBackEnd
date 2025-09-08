# Product Management APIs

## Overview

Product Management APIs handle all product catalog operations including creating, updating, searching, and managing products. These APIs support the B2B platform's product catalog functionality with brand associations and store-specific operations.

**Base URL**: `/products`

## Authentication Required

All endpoints require JWT authentication with appropriate roles.

---

## Endpoints

### 1. Create New Product (Admin/Store Admin Only)

Create a new product in the system catalog.

**Endpoint**: `POST /products`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request Body
```json
{
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "sku": "APL-IPH15P-256-BLK",
  "description": "Latest iPhone with advanced camera system and A17 Pro chip",
  "brandId": "brand-uuid-123",
  "createdByStoreId": "store-uuid-456",
  "category": "Electronics",
  "price": 39900.00,
  "images": [
    "https://example.com/iphone15pro-1.jpg",
    "https://example.com/iphone15pro-2.jpg"
  ],
  "attributes": {
    "color": "Black",
    "storage": "256GB",
    "connectivity": "5G"
  },
  "status": "ACTIVE"
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name (2-100 characters) |
| slug | string | Yes | URL-friendly identifier (3-100 chars, lowercase, numbers, hyphens) |
| sku | string | Yes | Stock Keeping Unit (3-50 characters) |
| description | string | No | Product description (max 1000 characters) |
| brandId | string | Yes | UUID of the brand this product belongs to |
| createdByStoreId | string | No | UUID of store that created this product (null for central products) |
| category | string | Yes | Product category (2-50 characters) |
| price | number | Yes | Product price (min 0, max 2 decimal places) |
| images | array | No | Array of image URLs |
| attributes | object | No | Product attributes (color, size, etc.) |
| status | enum | No | Product status: ACTIVE, INACTIVE, DISCONTINUED (default: ACTIVE) |

#### Request Example
```bash
curl -X POST "http://localhost:3001/products" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro 14-inch",
    "slug": "macbook-pro-14-inch",
    "sku": "APL-MBP14-512-SG",
    "description": "Powerful MacBook Pro with M3 chip and 14-inch Liquid Retina XDR display",
    "brandId": "apple-brand-uuid",
    "category": "Laptops",
    "price": 89900.00,
    "attributes": {
      "processor": "M3",
      "storage": "512GB SSD",
      "ram": "16GB",
      "color": "Space Gray"
    }
  }'
```

#### Success Response (201 Created)
```json
{
  "id": "product-uuid-789",
  "name": "MacBook Pro 14-inch",
  "slug": "macbook-pro-14-inch",
  "sku": "APL-MBP14-512-SG",
  "description": "Powerful MacBook Pro with M3 chip and 14-inch Liquid Retina XDR display",
  "brandId": "apple-brand-uuid",
  "createdByStoreId": null,
  "category": "Laptops",
  "price": 89900.00,
  "images": [],
  "attributes": {
    "processor": "M3",
    "storage": "512GB SSD",
    "ram": "16GB",
    "color": "Space Gray"
  },
  "status": "ACTIVE",
  "isActive": true,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-20T14:30:00.000Z",
  "brand": {
    "id": "apple-brand-uuid",
    "name": "Apple",
    "slug": "apple"
  }
}
```

#### Error Responses
```json
// 400 Bad Request - Validation Error
{
  "statusCode": 400,
  "message": [
    "name must be longer than or equal to 2 characters",
    "price must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request"
}

// 409 Conflict - SKU Already Exists
{
  "statusCode": 409,
  "message": "Product with SKU 'APL-MBP14-512-SG' already exists",
  "error": "Conflict"
}

// 403 Forbidden - Insufficient Permissions
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

---

### 2. Get All Products

Retrieve a list of all products in the system.

**Endpoint**: `GET /products`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/products" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response
```json
{
  "data": [
    {
      "id": "product-uuid-789",
      "name": "MacBook Pro 14-inch",
      "slug": "macbook-pro-14-inch",
      "sku": "APL-MBP14-512-SG",
      "description": "Powerful MacBook Pro with M3 chip",
      "category": "Laptops",
      "price": 89900.00,
      "images": ["https://example.com/macbook1.jpg"],
      "status": "ACTIVE",
      "createdAt": "2024-01-20T14:30:00.000Z",
      "brand": {
        "id": "apple-brand-uuid",
        "name": "Apple",
        "slug": "apple",
        "logo": "https://example.com/apple-logo.png"
      }
    },
    {
      "id": "product-uuid-456",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256-BLK",
      "category": "Smartphones",
      "price": 39900.00,
      "status": "ACTIVE",
      "createdAt": "2024-01-18T10:00:00.000Z",
      "brand": {
        "id": "apple-brand-uuid",
        "name": "Apple",
        "slug": "apple"
      }
    }
  ],
  "count": 2
}
```

---

### 3. Search Products with Filters

Search and filter products with various criteria.

**Endpoint**: `GET /products/search`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search in product name and description |
| brandId | string | Filter by brand UUID |
| category | string | Filter by category |
| status | enum | Filter by status (ACTIVE, INACTIVE, DISCONTINUED) |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| limit | number | Number of results (default: 20, max: 100) |
| offset | number | Results offset (default: 0) |

#### Request Examples
```bash
# Search by name
curl -X GET "http://localhost:3001/products/search?search=iPhone" \
  -H "Authorization: Bearer <jwt-token>"

# Filter by brand
curl -X GET "http://localhost:3001/products/search?brandId=apple-brand-uuid" \
  -H "Authorization: Bearer <jwt-token>"

# Filter by category and price range
curl -X GET "http://localhost:3001/products/search?category=Smartphones&minPrice=30000&maxPrice=50000" \
  -H "Authorization: Bearer <jwt-token>"

# Complex search with multiple filters
curl -X GET "http://localhost:3001/products/search?search=Pro&brandId=apple-brand-uuid&category=Laptops&limit=10" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "products": [
    {
      "id": "product-uuid-789",
      "name": "MacBook Pro 14-inch",
      "slug": "macbook-pro-14-inch",
      "sku": "APL-MBP14-512-SG",
      "description": "Powerful MacBook Pro with M3 chip",
      "category": "Laptops",
      "price": 89900.00,
      "images": ["https://example.com/macbook1.jpg"],
      "attributes": {
        "processor": "M3",
        "storage": "512GB SSD"
      },
      "status": "ACTIVE",
      "brand": {
        "name": "Apple",
        "slug": "apple",
        "logo": "https://example.com/apple-logo.png"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "offset": 0,
    "limit": 20,
    "hasMore": false
  },
  "filters": {
    "search": "Pro",
    "brandId": "apple-brand-uuid",
    "category": "Laptops"
  }
}
```

---

### 4. Get Active Products Only

Retrieve only products with ACTIVE status.

**Endpoint**: `GET /products/active`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/products/active" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "data": [
    {
      "id": "product-uuid-789",
      "name": "MacBook Pro 14-inch",
      "slug": "macbook-pro-14-inch",
      "sku": "APL-MBP14-512-SG",
      "price": 89900.00,
      "category": "Laptops",
      "status": "ACTIVE",
      "brand": {
        "name": "Apple",
        "slug": "apple"
      }
    }
  ],
  "count": 1
}
```

---

### 5. Get Products by Brand

Retrieve all products belonging to a specific brand.

**Endpoint**: `GET /products/brand/{brandId}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/products/brand/apple-brand-uuid" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "brand": {
    "id": "apple-brand-uuid",
    "name": "Apple",
    "slug": "apple",
    "logo": "https://example.com/apple-logo.png"
  },
  "products": [
    {
      "id": "product-uuid-789",
      "name": "MacBook Pro 14-inch",
      "slug": "macbook-pro-14-inch",
      "sku": "APL-MBP14-512-SG",
      "category": "Laptops",
      "price": 89900.00,
      "status": "ACTIVE",
      "createdAt": "2024-01-20T14:30:00.000Z"
    },
    {
      "id": "product-uuid-456",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256-BLK",
      "category": "Smartphones",
      "price": 39900.00,
      "status": "ACTIVE",
      "createdAt": "2024-01-18T10:00:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 6. Get Products by Store

Retrieve products created by a specific store.

**Endpoint**: `GET /products/store/{storeId}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/products/store/store-uuid-456" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "store": {
    "id": "store-uuid-456",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "products": [
    {
      "id": "product-uuid-123",
      "name": "Custom iPhone Case",
      "slug": "custom-iphone-case",
      "sku": "TPS-CASE-IPH15-001",
      "category": "Accessories",
      "price": 599.00,
      "status": "ACTIVE",
      "createdByStoreId": "store-uuid-456",
      "brand": {
        "name": "Store Brand",
        "slug": "store-brand"
      }
    }
  ],
  "count": 1
}
```

---

### 7. Get Product by ID

Retrieve detailed information about a specific product.

**Endpoint**: `GET /products/{id}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/products/product-uuid-789" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "product-uuid-789",
  "name": "MacBook Pro 14-inch",
  "slug": "macbook-pro-14-inch",
  "sku": "APL-MBP14-512-SG",
  "description": "Powerful MacBook Pro with M3 chip and 14-inch Liquid Retina XDR display",
  "brandId": "apple-brand-uuid",
  "createdByStoreId": null,
  "category": "Laptops",
  "price": 89900.00,
  "images": [
    "https://example.com/macbook-1.jpg",
    "https://example.com/macbook-2.jpg"
  ],
  "attributes": {
    "processor": "M3",
    "storage": "512GB SSD",
    "ram": "16GB",
    "color": "Space Gray",
    "screen": "14-inch Liquid Retina XDR"
  },
  "status": "ACTIVE",
  "isActive": true,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-25T16:45:00.000Z",
  "brand": {
    "id": "apple-brand-uuid",
    "name": "Apple",
    "slug": "apple",
    "description": "American multinational technology company",
    "logo": "https://example.com/apple-logo.png",
    "isActive": true
  },
  "createdByStore": null,
  "variants": [],
  "_count": {
    "variants": 0,
    "orderItems": 15
  }
}
```

---

### 8. Get Product Statistics (Admin/Store Admin Only)

Get detailed statistics for a specific product.

**Endpoint**: `GET /products/{id}/stats`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/products/product-uuid-789/stats" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Response
```json
{
  "product": {
    "id": "product-uuid-789",
    "name": "MacBook Pro 14-inch",
    "sku": "APL-MBP14-512-SG",
    "price": 89900.00,
    "status": "ACTIVE"
  },
  "stats": {
    "variants": {
      "total": 3,
      "active": 3
    },
    "stock": {
      "totalAvailable": 45,
      "totalReserved": 8,
      "totalSold": 127,
      "storesWithStock": 5
    },
    "orders": {
      "totalOrders": 89,
      "totalRevenue": 8001100.00,
      "averageOrderQuantity": 1.4,
      "thisMonth": {
        "orders": 12,
        "revenue": 1078800.00
      }
    },
    "performance": {
      "conversionRate": 78.5,
      "returnRate": 2.1,
      "averageRating": 4.7
    }
  },
  "generatedAt": "2024-01-20T15:30:00.000Z"
}
```

---

### 9. Get Product by Slug

Retrieve product information using its URL slug.

**Endpoint**: `GET /products/slug/{slug}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/products/slug/macbook-pro-14-inch" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "product-uuid-789",
  "name": "MacBook Pro 14-inch",
  "slug": "macbook-pro-14-inch",
  "sku": "APL-MBP14-512-SG",
  "description": "Powerful MacBook Pro with M3 chip",
  "category": "Laptops",
  "price": 89900.00,
  "images": ["https://example.com/macbook-1.jpg"],
  "status": "ACTIVE",
  "brand": {
    "name": "Apple",
    "slug": "apple",
    "logo": "https://example.com/apple-logo.png"
  }
}
```

---

### 10. Get Product by SKU

Retrieve product information using its SKU.

**Endpoint**: `GET /products/sku/{sku}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/products/sku/APL-MBP14-512-SG" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "product-uuid-789",
  "name": "MacBook Pro 14-inch",
  "slug": "macbook-pro-14-inch",
  "sku": "APL-MBP14-512-SG",
  "category": "Laptops",
  "price": 89900.00,
  "status": "ACTIVE",
  "brand": {
    "name": "Apple",
    "slug": "apple"
  }
}
```

---

### 11. Update Product (Admin/Store Admin Only)

Update product information.

**Endpoint**: `PATCH /products/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request Body
```json
{
  "name": "MacBook Pro 14-inch Updated",
  "description": "Updated: Powerful MacBook Pro with M3 chip and enhanced performance",
  "price": 91900.00,
  "images": [
    "https://example.com/macbook-new-1.jpg",
    "https://example.com/macbook-new-2.jpg"
  ],
  "attributes": {
    "processor": "M3",
    "storage": "512GB SSD",
    "ram": "16GB",
    "color": "Space Gray",
    "screen": "14-inch Liquid Retina XDR",
    "year": "2024"
  },
  "status": "ACTIVE"
}
```

#### Request Example
```bash
curl -X PATCH "http://localhost:3001/products/product-uuid-789" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro 14-inch M3 Updated",
    "description": "Latest MacBook Pro with M3 chip - Enhanced for 2024",
    "price": 91900.00
  }'
```

#### Success Response (200 OK)
```json
{
  "id": "product-uuid-789",
  "name": "MacBook Pro 14-inch M3 Updated",
  "slug": "macbook-pro-14-inch",
  "sku": "APL-MBP14-512-SG",
  "description": "Latest MacBook Pro with M3 chip - Enhanced for 2024",
  "price": 91900.00,
  "category": "Laptops",
  "status": "ACTIVE",
  "updatedAt": "2024-01-25T16:45:00.000Z",
  "brand": {
    "name": "Apple",
    "slug": "apple"
  }
}
```

#### Note for Store Admins
Store Admin users can only update products created by their own store. Central products require ADMIN role.

---

### 12. Delete Product (Admin Only)

Delete a product from the system.

**Endpoint**: `DELETE /products/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X DELETE "http://localhost:3001/products/product-uuid-789" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Success Response (200 OK)
```json
{
  "message": "Product deleted successfully",
  "deletedProductId": "product-uuid-789"
}
```

#### Error Responses
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}

// 409 Conflict - Product has dependencies
{
  "statusCode": 409,
  "message": "Cannot delete product with active stock or pending orders",
  "error": "Conflict",
  "details": {
    "activeStock": 45,
    "pendingOrders": 3
  }
}
```

---

## Product Status Management

### Product Status Values
| Status | Description |
|--------|-------------|
| `ACTIVE` | Product is available for sale |
| `INACTIVE` | Product is temporarily disabled |
| `DISCONTINUED` | Product is no longer available |

---

## Common Use Cases

### 1. Create Central Product (Admin)
```bash
curl -X POST "http://localhost:3001/products" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Galaxy S24",
    "slug": "samsung-galaxy-s24",
    "sku": "SAM-GS24-256-BLK",
    "brandId": "samsung-brand-uuid",
    "category": "Smartphones",
    "price": 35900.00,
    "description": "Latest Samsung flagship smartphone"
  }'
```

### 2. Create Store-specific Product (Store Admin)
```bash
curl -X POST "http://localhost:3001/products" \
  -H "Authorization: Bearer <store-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Phone Case",
    "slug": "custom-phone-case-001",
    "sku": "STORE-CASE-001",
    "brandId": "store-brand-uuid",
    "createdByStoreId": "my-store-uuid",
    "category": "Accessories",
    "price": 599.00
  }'
```

### 3. Search Products by Multiple Criteria
```bash
curl -X GET "http://localhost:3001/products/search?category=Smartphones&minPrice=20000&maxPrice=50000&brandId=apple-brand-uuid" \
  -H "Authorization: Bearer <token>"
```

### 4. Update Product Price
```bash
curl -X PATCH "http://localhost:3001/products/product-uuid" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 37900.00
  }'
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request - Validation Errors
```json
{
  "statusCode": 400,
  "message": [
    "name must be longer than or equal to 2 characters",
    "price must be a positive number"
  ],
  "error": "Bad Request"
}
```

#### 403 Forbidden - Permission Denied
```json
{
  "statusCode": 403,
  "message": "Store admins can only update their own products",
  "error": "Forbidden"
}
```

#### 409 Conflict - Duplicate SKU
```json
{
  "statusCode": 409,
  "message": "Product with SKU 'APL-IPH15P-256' already exists",
  "error": "Conflict"
}
```

---

## Product Attributes System

### Common Attribute Examples
```json
{
  // Electronics
  "processor": "M3",
  "storage": "512GB SSD",
  "ram": "16GB",
  "screen": "14-inch Retina",
  "connectivity": "WiFi 6E, Bluetooth 5.3",
  
  // Fashion
  "size": "L",
  "color": "Navy Blue",
  "material": "100% Cotton",
  "fit": "Regular",
  
  // General
  "warranty": "1 Year",
  "origin": "USA",
  "weight": "1.2kg",
  "dimensions": "31.26 x 22.12 x 1.55 cm"
}
```

### Searchable Attributes
Products can be searched by their attributes using the search functionality. Common searchable fields include:
- Color, Size, Material (Fashion)
- Processor, RAM, Storage (Electronics)
- Brand-specific attributes

---

## Notes

1. **SKU Uniqueness**: Product SKUs must be unique system-wide
2. **Slug Uniqueness**: Product slugs must be unique within the same brand
3. **Store Products**: Products created by stores have `createdByStoreId` set
4. **Central Products**: Products created by admins are available to all entitled stores
5. **Image Management**: Images should be uploaded via the File Upload API first
6. **Price Format**: Prices are stored as numbers with up to 2 decimal places
7. **Category Flexibility**: Categories are free-text for maximum flexibility

---

## Testing Examples

### Complete Product Management Flow
```bash
# 1. Create product (Admin)
curl -X POST "http://localhost:3001/products" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "sku": "TEST-001",
    "brandId": "brand-uuid",
    "category": "Test Category",
    "price": 999.00
  }'

# 2. Search products
curl -X GET "http://localhost:3001/products/search?search=Test" \
  -H "Authorization: Bearer <token>"

# 3. Update product
curl -X PATCH "http://localhost:3001/products/{product-id}" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1299.00,
    "description": "Updated test product"
  }'

# 4. Get product statistics
curl -X GET "http://localhost:3001/products/{product-id}/stats" \
  -H "Authorization: Bearer <admin-token>"
```