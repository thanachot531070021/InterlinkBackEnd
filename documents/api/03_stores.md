# Store Management APIs

## Overview

Store Management APIs handle all store-related operations including creating, updating, and managing store information. These APIs support the B2B platform's store management functionality.

**Base URL**: `/stores`

## Authentication Required

All endpoints require JWT authentication with appropriate roles.

---

## Endpoints

### 1. Create New Store (Admin Only)

Create a new store in the system.

**Endpoint**: `POST /stores`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request Body
```json
{
  "name": "My Awesome Store",
  "slug": "my-awesome-store",
  "description": "A premium retail store offering quality products",
  "email": "store@example.com",
  "phone": "+66-123-456-789",
  "address": {
    "street": "123 Main Street",
    "city": "Bangkok",
    "province": "Bangkok",
    "postalCode": "10110",
    "country": "Thailand"
  },
  "logo": "https://example.com/logo.png",
  "status": "ACTIVE",
  "subscriptionStatus": "TRIAL"
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Store name (2-100 characters) |
| slug | string | Yes | URL-friendly identifier (3-50 chars, lowercase, numbers, hyphens only) |
| description | string | No | Store description (max 500 characters) |
| email | string | Yes | Store email address |
| phone | string | No | Store phone number (max 20 characters) |
| address | object | No | Store address object |
| logo | string | No | Store logo URL |
| status | enum | No | Store status: ACTIVE, INACTIVE, SUSPENDED (default: ACTIVE) |
| subscriptionStatus | enum | No | Subscription status: TRIAL, ACTIVE, EXPIRED, CANCELLED (default: TRIAL) |

#### Request Example
```bash
curl -X POST "http://localhost:3001/stores" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Paradise Store",
    "slug": "tech-paradise",
    "description": "Your one-stop shop for all tech gadgets",
    "email": "info@techparadise.com",
    "phone": "+66-987-654-321",
    "address": {
      "street": "456 Technology Ave",
      "city": "Bangkok",
      "province": "Bangkok",
      "postalCode": "10200",
      "country": "Thailand"
    }
  }'
```

#### Success Response (201 Created)
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "name": "Tech Paradise Store",
  "slug": "tech-paradise",
  "description": "Your one-stop shop for all tech gadgets",
  "email": "info@techparadise.com",
  "phone": "+66-987-654-321",
  "address": {
    "street": "456 Technology Ave",
    "city": "Bangkok",
    "province": "Bangkok",
    "postalCode": "10200",
    "country": "Thailand"
  },
  "logo": null,
  "status": "ACTIVE",
  "subscriptionStatus": "TRIAL",
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
  "message": "Store with this slug already exists",
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

### 2. Get All Stores (Admin Only)

Retrieve a list of all stores in the system.

**Endpoint**: `GET /stores`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/stores" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response
```json
{
  "data": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "name": "Tech Paradise Store",
      "slug": "tech-paradise",
      "description": "Your one-stop shop for all tech gadgets",
      "email": "info@techparadise.com",
      "phone": "+66-987-654-321",
      "status": "ACTIVE",
      "subscriptionStatus": "ACTIVE",
      "isActive": true,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "_count": {
        "users": 3,
        "entitlements": 2,
        "orders": 15
      }
    },
    {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "name": "Fashion Hub",
      "slug": "fashion-hub",
      "email": "contact@fashionhub.com",
      "status": "ACTIVE",
      "subscriptionStatus": "TRIAL",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "_count": {
        "users": 2,
        "entitlements": 1,
        "orders": 8
      }
    }
  ],
  "count": 2
}
```

---

### 3. Get Active Stores Only

Retrieve only active stores (available to all authenticated users).

**Endpoint**: `GET /stores/active`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/stores/active" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "data": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "name": "Tech Paradise Store",
      "slug": "tech-paradise",
      "description": "Your one-stop shop for all tech gadgets",
      "email": "info@techparadise.com",
      "status": "ACTIVE",
      "logo": "https://example.com/tech-logo.png",
      "createdAt": "2024-01-20T14:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 4. Get Store by ID

Retrieve detailed information about a specific store.

**Endpoint**: `GET /stores/{id}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/stores/456e7890-e89b-12d3-a456-426614174001" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "name": "Tech Paradise Store",
  "slug": "tech-paradise",
  "description": "Your one-stop shop for all tech gadgets",
  "email": "info@techparadise.com",
  "phone": "+66-987-654-321",
  "address": {
    "street": "456 Technology Ave",
    "city": "Bangkok",
    "province": "Bangkok",
    "postalCode": "10200",
    "country": "Thailand"
  },
  "logo": "https://example.com/tech-logo.png",
  "status": "ACTIVE",
  "subscriptionStatus": "ACTIVE",
  "isActive": true,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-25T16:45:00.000Z",
  "users": [
    {
      "id": "user1-uuid",
      "name": "Store Manager",
      "email": "manager@techparadise.com",
      "role": "STORE_ADMIN"
    },
    {
      "id": "user2-uuid",
      "name": "Store Staff",
      "email": "staff@techparadise.com",
      "role": "STORE_STAFF"
    }
  ],
  "entitlements": [
    {
      "id": "ent1-uuid",
      "brand": {
        "id": "brand1-uuid",
        "name": "Apple",
        "slug": "apple"
      },
      "canSell": true,
      "canOrder": true
    }
  ]
}
```

---

### 5. Get Store Statistics (Admin/Store Admin Only)

Get detailed statistics for a specific store.

**Endpoint**: `GET /stores/{id}/stats`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/stores/456e7890-e89b-12d3-a456-426614174001/stats" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Response
```json
{
  "store": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "stats": {
    "users": {
      "total": 3,
      "active": 3,
      "byRole": {
        "STORE_ADMIN": 1,
        "STORE_STAFF": 2
      }
    },
    "brands": {
      "total": 2,
      "canSell": 2,
      "canOrder": 2
    },
    "products": {
      "total": 45,
      "active": 42,
      "outOfStock": 3
    },
    "orders": {
      "total": 128,
      "pending": 5,
      "confirmed": 98,
      "cancelled": 15,
      "totalRevenue": 1250000.00,
      "thisMonth": {
        "count": 23,
        "revenue": 185000.00
      }
    },
    "subscription": {
      "status": "ACTIVE",
      "validUntil": "2024-12-31T23:59:59.000Z",
      "daysRemaining": 285
    }
  },
  "generatedAt": "2024-01-20T15:30:00.000Z"
}
```

---

### 6. Get Store Brand Entitlements

Get all brand entitlements for a specific store.

**Endpoint**: `GET /stores/{id}/brands`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/stores/456e7890-e89b-12d3-a456-426614174001/brands" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "store": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "entitlements": [
    {
      "id": "ent1-uuid",
      "brandId": "brand1-uuid",
      "canSell": true,
      "canOrder": true,
      "isActive": true,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "brand": {
        "id": "brand1-uuid",
        "name": "Apple",
        "slug": "apple",
        "logo": "https://example.com/apple-logo.png",
        "isActive": true
      }
    },
    {
      "id": "ent2-uuid",
      "brandId": "brand2-uuid",
      "canSell": true,
      "canOrder": false,
      "isActive": true,
      "createdAt": "2024-01-22T10:15:00.000Z",
      "brand": {
        "id": "brand2-uuid",
        "name": "Samsung",
        "slug": "samsung",
        "logo": "https://example.com/samsung-logo.png",
        "isActive": true
      }
    }
  ],
  "count": 2
}
```

---

### 7. Get Store by Slug

Retrieve store information using its URL slug.

**Endpoint**: `GET /stores/slug/{slug}`  
**Authorization**: Bearer Token  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/stores/slug/tech-paradise" \
  -H "Authorization: Bearer <jwt-token>"
```

#### Response
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "name": "Tech Paradise Store",
  "slug": "tech-paradise",
  "description": "Your one-stop shop for all tech gadgets",
  "email": "info@techparadise.com",
  "phone": "+66-987-654-321",
  "logo": "https://example.com/tech-logo.png",
  "status": "ACTIVE",
  "isActive": true,
  "createdAt": "2024-01-20T14:30:00.000Z"
}
```

---

### 8. Update Store (Admin/Store Admin Only)

Update store information.

**Endpoint**: `PATCH /stores/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request Body
```json
{
  "name": "Tech Paradise Store Updated",
  "description": "Updated description for the store",
  "phone": "+66-111-222-333",
  "address": {
    "street": "789 New Address Street",
    "city": "Bangkok",
    "province": "Bangkok",
    "postalCode": "10300",
    "country": "Thailand"
  },
  "logo": "https://example.com/new-logo.png"
}
```

#### Request Example
```bash
curl -X PATCH "http://localhost:3001/stores/456e7890-e89b-12d3-a456-426614174001" \
  -H "Authorization: Bearer <store-admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Paradise Store Updated",
    "description": "Updated: Your one-stop shop for all tech gadgets and accessories",
    "phone": "+66-111-222-333"
  }'
```

#### Success Response (200 OK)
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "name": "Tech Paradise Store Updated",
  "slug": "tech-paradise",
  "description": "Updated: Your one-stop shop for all tech gadgets and accessories",
  "email": "info@techparadise.com",
  "phone": "+66-111-222-333",
  "address": {
    "street": "456 Technology Ave",
    "city": "Bangkok",
    "province": "Bangkok",
    "postalCode": "10200",
    "country": "Thailand"
  },
  "logo": "https://example.com/tech-logo.png",
  "status": "ACTIVE",
  "subscriptionStatus": "ACTIVE",
  "isActive": true,
  "updatedAt": "2024-01-25T16:45:00.000Z"
}
```

#### Note for Store Admins
Store Admin users can only update their own store. The system validates that the authenticated user's `storeId` matches the store being updated.

---

### 9. Delete Store (Admin Only)

Delete a store from the system.

**Endpoint**: `DELETE /stores/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X DELETE "http://localhost:3001/stores/456e7890-e89b-12d3-a456-426614174001" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Success Response (200 OK)
```json
{
  "message": "Store deleted successfully",
  "deletedStoreId": "456e7890-e89b-12d3-a456-426614174001"
}
```

#### Error Responses
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Store not found",
  "error": "Not Found"
}

// 409 Conflict - Store has dependencies
{
  "statusCode": 409,
  "message": "Cannot delete store with active users or orders",
  "error": "Conflict",
  "details": {
    "activeUsers": 3,
    "pendingOrders": 5
  }
}
```

---

## Store Status Management

### Store Status Values
| Status | Description |
|--------|-------------|
| `ACTIVE` | Store is operational and can process orders |
| `INACTIVE` | Store is temporarily disabled |
| `SUSPENDED` | Store is suspended due to policy violations |

### Subscription Status Values  
| Status | Description |
|--------|-------------|
| `TRIAL` | Store is in trial period |
| `ACTIVE` | Store has active subscription |
| `EXPIRED` | Subscription has expired |
| `CANCELLED` | Subscription was cancelled |

---

## Common Use Cases

### 1. Create Store for New Client
```bash
curl -X POST "http://localhost:3001/stores" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Client Store",
    "slug": "new-client-store",
    "email": "client@example.com",
    "description": "Professional retail store for new client"
  }'
```

### 2. Update Store Profile (Store Admin)
```bash
curl -X PATCH "http://localhost:3001/stores/store-id" \
  -H "Authorization: Bearer <store-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated store description",
    "phone": "+66-999-888-777",
    "logo": "https://newdomain.com/logo.png"
  }'
```

### 3. Check Store Subscription Status
```bash
curl -X GET "http://localhost:3001/stores/store-id/stats" \
  -H "Authorization: Bearer <admin-token>"

# Look for subscription.status in the response
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
    "email must be a valid email"
  ],
  "error": "Bad Request"
}
```

#### 403 Forbidden - Permission Denied
```json
{
  "statusCode": 403,
  "message": "You can only update your own store",
  "error": "Forbidden"
}
```

#### 409 Conflict - Duplicate Slug
```json
{
  "statusCode": 409,
  "message": "Store with slug 'tech-paradise' already exists",
  "error": "Conflict"
}
```

---

## Notes

1. **Slug Uniqueness**: Store slugs must be unique system-wide and are used in storefront URLs
2. **Address Flexibility**: Address field accepts any JSON object structure for international addresses
3. **Subscription Management**: Subscription status affects store functionality
4. **Cascade Operations**: Deleting a store requires handling of associated users, orders, and stock
5. **File Upload**: Logo URLs should be uploaded via the File Upload API first
6. **Store Admin Restrictions**: Store Admins can only manage their own store

---

## Testing Examples

### Complete Store Creation Flow
```bash
# 1. Create store (Admin)
curl -X POST "http://localhost:3001/stores" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Store",
    "slug": "test-store",
    "email": "test@store.com"
  }'

# 2. Get created store details
curl -X GET "http://localhost:3001/stores/{store-id}" \
  -H "Authorization: Bearer <token>"

# 3. Update store information
curl -X PATCH "http://localhost:3001/stores/{store-id}" \
  -H "Authorization: Bearer <store-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Test store for development"
  }'
```