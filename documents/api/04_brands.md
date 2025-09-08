# Brand Management APIs

## Overview

Brand Management APIs handle all brand-related operations including creating, updating, and managing brand information. These APIs support the B2B platform's multi-brand functionality.

**Base URL**: `/brands`

## Authentication Required

All endpoints require JWT authentication with appropriate roles.

---

## Endpoints

### 1. Create New Brand (Admin Only)

Create a new brand in the system.

**Endpoint**: `POST /brands`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request Body
```json
{
  "name": "Tech Gadgets",
  "slug": "tech-gadgets",
  "description": "Latest technology and gadgets for modern life",
  "logo": "https://example.com/tech-gadgets-logo.png",
  "isActive": true
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Brand name (2-100 characters) |
| slug | string | Yes | URL-friendly identifier (2-50 chars, lowercase, numbers, hyphens only) |
| description | string | No | Brand description (max 500 characters) |
| logo | string | No | Brand logo URL |
| isActive | boolean | No | Whether the brand is active (default: true) |

#### Request Example
```bash
curl -X POST "http://localhost:3001/brands" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple",
    "slug": "apple",
    "description": "American multinational technology company",
    "logo": "https://example.com/apple-logo.png"
  }'
```

#### Success Response (201 Created)
```json
{
  "id": "brand-uuid-123",
  "name": "Apple",
  "slug": "apple",
  "description": "American multinational technology company",
  "logo": "https://example.com/apple-logo.png",
  "isActive": true,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-20T14:30:00.000Z"
}
```

#### Error Responses
```json
// 400 Bad Request - Validation Error
{
  "statusCode": 400,
  "message": [
    "name must be longer than or equal to 2 characters",
    "slug can only contain lowercase letters, numbers, and hyphens"
  ],
  "error": "Bad Request"
}

// 409 Conflict - Slug Already Exists
{
  "statusCode": 409,
  "message": "Brand with slug 'apple' already exists",
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

### 2. Get All Brands

Retrieve a list of all brands in the system.

**Endpoint**: `GET /brands`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/brands" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response
```json
{
  "data": [
    {
      "id": "brand-uuid-123",
      "name": "Apple",
      "slug": "apple",
      "description": "American multinational technology company",
      "logo": "https://example.com/apple-logo.png",
      "isActive": true,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "_count": {
        "products": 25,
        "entitlements": 12
      }
    },
    {
      "id": "brand-uuid-456",
      "name": "Samsung",
      "slug": "samsung",
      "description": "South Korean multinational electronics company",
      "logo": "https://example.com/samsung-logo.png",
      "isActive": true,
      "createdAt": "2024-01-18T10:00:00.000Z",
      "_count": {
        "products": 18,
        "entitlements": 8
      }
    }
  ],
  "count": 2
}
```

---

### 3. Get Active Brands Only

Retrieve only active brands.

**Endpoint**: `GET /brands/active`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/brands/active" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "data": [
    {
      "id": "brand-uuid-123",
      "name": "Apple",
      "slug": "apple",
      "description": "American multinational technology company",
      "logo": "https://example.com/apple-logo.png",
      "isActive": true,
      "createdAt": "2024-01-20T14:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 4. Get Brand by ID

Retrieve detailed information about a specific brand.

**Endpoint**: `GET /brands/{id}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/brands/brand-uuid-123" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "brand-uuid-123",
  "name": "Apple",
  "slug": "apple",
  "description": "American multinational technology company specializing in consumer electronics, software and online services.",
  "logo": "https://example.com/apple-logo.png",
  "isActive": true,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-25T16:45:00.000Z",
  "products": [
    {
      "id": "product-uuid-789",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256-BLK",
      "price": 39900.00,
      "status": "ACTIVE",
      "category": "Smartphones"
    },
    {
      "id": "product-uuid-456",
      "name": "MacBook Pro 14-inch",
      "slug": "macbook-pro-14-inch", 
      "sku": "APL-MBP14-512-SG",
      "price": 89900.00,
      "status": "ACTIVE",
      "category": "Laptops"
    }
  ],
  "entitlements": [
    {
      "id": "ent-uuid-1",
      "store": {
        "id": "store-uuid-1",
        "name": "Tech Paradise Store",
        "slug": "tech-paradise"
      },
      "canSell": true,
      "canOrder": true,
      "isActive": true
    }
  ],
  "_count": {
    "products": 25,
    "activeProducts": 23,
    "entitlements": 12,
    "activeStores": 10
  }
}
```

---

### 5. Get Brand Statistics (Admin Only)

Get detailed statistics for a specific brand.

**Endpoint**: `GET /brands/{id}/stats`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/brands/brand-uuid-123/stats" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Response
```json
{
  "brand": {
    "id": "brand-uuid-123",
    "name": "Apple",
    "slug": "apple"
  },
  "stats": {
    "products": {
      "total": 25,
      "active": 23,
      "inactive": 2,
      "discontinued": 0,
      "byCategory": {
        "Smartphones": 8,
        "Laptops": 6,
        "Tablets": 4,
        "Accessories": 7
      }
    },
    "stores": {
      "totalEntitlements": 12,
      "activeStores": 10,
      "canSell": 12,
      "canOrder": 8
    },
    "sales": {
      "totalOrders": 1250,
      "totalRevenue": 125000000.00,
      "averageOrderValue": 100000.00,
      "thisMonth": {
        "orders": 89,
        "revenue": 8900000.00
      },
      "topSellingProducts": [
        {
          "id": "product-uuid-789",
          "name": "iPhone 15 Pro",
          "orderCount": 156,
          "revenue": 6224400.00
        }
      ]
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

### 6. Get Brand by Slug

Retrieve brand information using its URL slug.

**Endpoint**: `GET /brands/slug/{slug}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/brands/slug/apple" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "brand-uuid-123",
  "name": "Apple",
  "slug": "apple",
  "description": "American multinational technology company",
  "logo": "https://example.com/apple-logo.png",
  "isActive": true,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "productCount": 25,
  "storeCount": 10
}
```

---

### 7. Update Brand (Admin Only)

Update brand information.

**Endpoint**: `PATCH /brands/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request Body
```json
{
  "name": "Apple Inc. Updated",
  "description": "Updated: American multinational technology company known for innovative consumer electronics",
  "logo": "https://example.com/apple-new-logo.png",
  "isActive": true
}
```

#### Request Example
```bash
curl -X PATCH "http://localhost:3001/brands/brand-uuid-123" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple Inc.",
    "description": "Updated description for Apple brand",
    "logo": "https://example.com/apple-updated-logo.png"
  }'
```

#### Success Response (200 OK)
```json
{
  "id": "brand-uuid-123",
  "name": "Apple Inc.",
  "slug": "apple",
  "description": "Updated description for Apple brand",
  "logo": "https://example.com/apple-updated-logo.png",
  "isActive": true,
  "updatedAt": "2024-01-25T16:45:00.000Z"
}
```

---

### 8. Delete Brand (Admin Only)

Delete a brand from the system.

**Endpoint**: `DELETE /brands/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X DELETE "http://localhost:3001/brands/brand-uuid-123" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Success Response (200 OK)
```json
{
  "message": "Brand deleted successfully",
  "deletedBrandId": "brand-uuid-123"
}
```

#### Error Responses
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Brand not found",
  "error": "Not Found"
}

// 409 Conflict - Brand has dependencies
{
  "statusCode": 409,
  "message": "Cannot delete brand with active products or store entitlements",
  "error": "Conflict",
  "details": {
    "activeProducts": 23,
    "activeEntitlements": 10
  }
}
```

---

## Brand Management Features

### Brand Status Management
- **Active**: Brand is available for store entitlements and product creation
- **Inactive**: Brand is temporarily disabled but data is preserved

### Brand Relationships
- **Products**: Each product belongs to one brand
- **Store Entitlements**: Stores can be entitled to sell specific brands
- **Orders**: Orders are tracked by brand through products

---

## Common Use Cases

### 1. Create New Brand (Admin)
```bash
curl -X POST "http://localhost:3001/brands" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike",
    "slug": "nike",
    "description": "American multinational corporation engaged in footwear and apparel",
    "logo": "https://example.com/nike-logo.png"
  }'
```

### 2. Get Brand Product Catalog
```bash
curl -X GET "http://localhost:3001/brands/brand-uuid/products" \
  -H "Authorization: Bearer <token>"
```

### 3. Update Brand Information
```bash
curl -X PATCH "http://localhost:3001/brands/brand-uuid" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated brand description",
    "logo": "https://newdomain.com/new-logo.png"
  }'
```

### 4. Check Brand Performance
```bash
curl -X GET "http://localhost:3001/brands/brand-uuid/stats" \
  -H "Authorization: Bearer <admin-token>"
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
    "slug can only contain lowercase letters, numbers, and hyphens"
  ],
  "error": "Bad Request"
}
```

#### 409 Conflict - Duplicate Slug
```json
{
  "statusCode": 409,
  "message": "Brand with slug 'apple' already exists",
  "error": "Conflict"
}
```

#### 403 Forbidden - Admin Only
```json
{
  "statusCode": 403,
  "message": "Only administrators can manage brands",
  "error": "Forbidden"
}
```

---

## Brand Integration

### With Store Entitlements
Brands are linked to stores through entitlements, which define:
- Which stores can sell products from this brand
- Which stores can order products from this brand
- Permission levels and restrictions

### With Products
All products must belong to a brand:
- Products inherit brand identity
- Brand deactivation affects product visibility
- Brand deletion requires handling existing products

### With Orders
Orders are tracked by brand through their products:
- Revenue reporting by brand
- Brand performance analytics
- Cross-brand order analysis

---

## Notes

1. **Slug Uniqueness**: Brand slugs must be unique system-wide
2. **Cascade Operations**: Deleting a brand requires handling associated products and entitlements
3. **Logo Management**: Logo URLs should be uploaded via the File Upload API first
4. **Brand Hierarchy**: Currently flat structure, but extensible for brand families
5. **Internationalization**: Brand names and descriptions support Unicode characters

---

## Testing Examples

### Complete Brand Management Flow
```bash
# 1. Create brand (Admin)
BRAND_RESPONSE=$(curl -X POST "http://localhost:3001/brands" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Brand", "slug": "test-brand", "description": "Test brand for development"}')

BRAND_ID=$(echo $BRAND_RESPONSE | jq -r '.id')

# 2. Get brand details
curl -X GET "http://localhost:3001/brands/$BRAND_ID" \
  -H "Authorization: Bearer <token>"

# 3. Update brand
curl -X PATCH "http://localhost:3001/brands/$BRAND_ID" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated test brand description"}'

# 4. Get brand statistics
curl -X GET "http://localhost:3001/brands/$BRAND_ID/stats" \
  -H "Authorization: Bearer <admin-token>"

# 5. List all brands
curl -X GET "http://localhost:3001/brands" \
  -H "Authorization: Bearer <token>"
```