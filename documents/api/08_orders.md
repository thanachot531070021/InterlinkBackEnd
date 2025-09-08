# Order Management APIs

## Overview

Order Management APIs handle all order-related operations including creating orders, managing order status, and tracking order statistics. These APIs include automatic stock reservation functionality to ensure inventory consistency.

**Base URL**: `/api/orders` (Note: Different from other APIs)

## Authentication Required

All endpoints require JWT authentication with appropriate roles.

---

## Endpoints

### 1. Create New Order

Create a new order with automatic stock reservation.

**Endpoint**: `POST /api/orders`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN, STORE_STAFF

#### Request Body
```json
{
  "storeId": "store-uuid-123",
  "customer": {
    "name": "John Doe",
    "phone": "+66-81-123-4567",
    "email": "john.doe@example.com",
    "address": {
      "street": "123 Main Street",
      "city": "Bangkok",
      "province": "Bangkok",
      "postalCode": "10110",
      "country": "Thailand"
    }
  },
  "items": [
    {
      "productId": "product-uuid-456",
      "variantId": "variant-uuid-789",
      "quantity": 2,
      "unitPrice": 1500.00
    },
    {
      "productId": "product-uuid-789",
      "quantity": 1,
      "unitPrice": 3000.00
    }
  ],
  "notes": "Please deliver in the morning",
  "reservationMinutes": 60
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| storeId | string | Yes | UUID of the store processing this order |
| customer.name | string | Yes | Customer's full name |
| customer.phone | string | Yes | Customer's phone number (Thai format) |
| customer.email | string | Yes | Customer's email address |
| customer.address | object | Yes | Customer's delivery address |
| items | array | Yes | Array of order items |
| items[].productId | string | Yes | Product UUID |
| items[].variantId | string | No | Product variant UUID (if applicable) |
| items[].quantity | number | Yes | Quantity to order (min: 1) |
| items[].unitPrice | number | Yes | Unit price at time of order |
| notes | string | No | Order notes or special instructions |
| reservationMinutes | number | No | Stock reservation duration in minutes (default: 60) |

#### Request Example
```bash
curl -X POST "http://localhost:3001/api/orders" \
  -H "Authorization: Bearer <store-admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "tech-store-uuid",
    "customer": {
      "name": "Alice Johnson",
      "phone": "+66-87-999-8888",
      "email": "alice@example.com",
      "address": {
        "street": "456 Tech Avenue",
        "city": "Bangkok",
        "province": "Bangkok",
        "postalCode": "10200",
        "country": "Thailand"
      }
    },
    "items": [
      {
        "productId": "iphone-product-uuid",
        "quantity": 1,
        "unitPrice": 39900.00
      },
      {
        "productId": "case-product-uuid",
        "quantity": 2,
        "unitPrice": 599.00
      }
    ],
    "notes": "Gift wrapping required"
  }'
```

#### Success Response (201 Created)
```json
{
  "id": "order-uuid-123",
  "status": "PENDING",
  "totalAmount": 41098.00,
  "notes": "Gift wrapping required",
  "createdAt": "2024-01-20T14:30:00.000Z",
  "customer": {
    "id": "customer-uuid-456",
    "name": "Alice Johnson",
    "phone": "+66-87-999-8888",
    "email": "alice@example.com",
    "address": {
      "street": "456 Tech Avenue",
      "city": "Bangkok",
      "province": "Bangkok",
      "postalCode": "10200",
      "country": "Thailand"
    }
  },
  "store": {
    "id": "tech-store-uuid",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "items": [
    {
      "id": "order-item-1",
      "quantity": 1,
      "unitPrice": 39900.00,
      "totalPrice": 39900.00,
      "product": {
        "id": "iphone-product-uuid",
        "name": "iPhone 15 Pro",
        "sku": "APL-IPH15P-256-BLK",
        "brand": {
          "name": "Apple",
          "slug": "apple"
        }
      }
    },
    {
      "id": "order-item-2", 
      "quantity": 2,
      "unitPrice": 599.00,
      "totalPrice": 1198.00,
      "product": {
        "id": "case-product-uuid",
        "name": "iPhone Case Pro",
        "sku": "CASE-IPH15P-001"
      }
    }
  ],
  "reservations": [
    {
      "id": "reservation-1",
      "productId": "iphone-product-uuid",
      "quantity": 1,
      "expiresAt": "2024-01-20T15:30:00.000Z",
      "status": "ACTIVE"
    },
    {
      "id": "reservation-2",
      "productId": "case-product-uuid", 
      "quantity": 2,
      "expiresAt": "2024-01-20T15:30:00.000Z",
      "status": "ACTIVE"
    }
  ]
}
```

#### Error Responses
```json
// 409 Conflict - Insufficient Stock
{
  "statusCode": 409,
  "message": "Insufficient stock for requested items",
  "error": "Conflict",
  "details": {
    "insufficientItems": [
      {
        "productId": "iphone-product-uuid",
        "requested": 5,
        "available": 2
      }
    ]
  }
}

// 400 Bad Request - Validation Error
{
  "statusCode": 400,
  "message": [
    "customer.email must be a valid email",
    "items[0].quantity must be a positive number"
  ],
  "error": "Bad Request"
}
```

---

### 2. Search Orders

Search and filter orders with various criteria and pagination.

**Endpoint**: `GET /api/orders/search`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN, STORE_STAFF

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| storeId | string | Filter by store UUID |
| customerId | string | Filter by customer UUID |
| status | enum | Filter by order status |
| search | string | Search by customer name or email |
| dateFrom | string | Date from (ISO string) |
| dateTo | string | Date to (ISO string) |
| offset | number | Number of results to skip (default: 0) |
| limit | number | Number of results to return (default: 50) |

#### Order Status Values
- `PENDING` - Order created, awaiting confirmation
- `CONFIRMED` - Order confirmed, stock allocated
- `PROCESSING` - Order being processed  
- `SHIPPED` - Order shipped to customer
- `DELIVERED` - Order delivered successfully
- `CANCELLED` - Order cancelled
- `RETURNED` - Order returned by customer

#### Request Examples
```bash
# Search by customer name
curl -X GET "http://localhost:3001/api/orders/search?search=Alice" \
  -H "Authorization: Bearer <token>"

# Filter by store and status
curl -X GET "http://localhost:3001/api/orders/search?storeId=tech-store-uuid&status=PENDING" \
  -H "Authorization: Bearer <token>"

# Date range filter
curl -X GET "http://localhost:3001/api/orders/search?dateFrom=2024-01-01T00:00:00.000Z&dateTo=2024-01-31T23:59:59.999Z" \
  -H "Authorization: Bearer <token>"

# Pagination
curl -X GET "http://localhost:3001/api/orders/search?limit=20&offset=40" \
  -H "Authorization: Bearer <token>"
```

#### Response
```json
{
  "orders": [
    {
      "id": "order-uuid-123",
      "status": "PENDING",
      "totalAmount": 41098.00,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "customer": {
        "id": "customer-uuid-456",
        "name": "Alice Johnson",
        "email": "alice@example.com"
      },
      "store": {
        "id": "tech-store-uuid",
        "name": "Tech Paradise Store",
        "slug": "tech-paradise"
      }
    },
    {
      "id": "order-uuid-789",
      "status": "CONFIRMED",
      "totalAmount": 89900.00,
      "createdAt": "2024-01-19T10:15:00.000Z",
      "confirmedAt": "2024-01-19T11:00:00.000Z",
      "customer": {
        "id": "customer-uuid-321",
        "name": "Bob Wilson",
        "email": "bob@example.com"
      },
      "store": {
        "id": "tech-store-uuid",
        "name": "Tech Paradise Store",
        "slug": "tech-paradise"
      }
    }
  ],
  "pagination": {
    "total": 156,
    "offset": 0,
    "limit": 50,
    "hasMore": true
  }
}
```

---

### 3. Get Store Orders

Retrieve all orders for a specific store.

**Endpoint**: `GET /api/orders/store/{storeId}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN, STORE_STAFF

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| status | enum | Filter by order status |
| limit | number | Number of results (default: 50) |
| offset | number | Results to skip (default: 0) |

#### Request
```bash
curl -X GET "http://localhost:3001/api/orders/store/tech-store-uuid?status=PENDING&limit=20" \
  -H "Authorization: Bearer <store-admin-token>"
```

#### Response
```json
{
  "store": {
    "id": "tech-store-uuid",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "orders": [
    {
      "id": "order-uuid-123",
      "status": "PENDING",
      "totalAmount": 41098.00,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "customer": {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "phone": "+66-87-999-8888"
      },
      "itemCount": 2,
      "reservationExpiresAt": "2024-01-20T15:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 23,
    "offset": 0,
    "limit": 20,
    "hasMore": true
  }
}
```

---

### 4. Get Customer Orders

Retrieve all orders for a specific customer.

**Endpoint**: `GET /api/orders/customer/{customerId}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN, STORE_STAFF

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of results (default: 20) |
| offset | number | Results to skip (default: 0) |

#### Request
```bash
curl -X GET "http://localhost:3001/api/orders/customer/customer-uuid-456?limit=10" \
  -H "Authorization: Bearer <token>"
```

#### Response
```json
{
  "customer": {
    "id": "customer-uuid-456",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+66-87-999-8888"
  },
  "orders": [
    {
      "id": "order-uuid-123",
      "status": "PENDING",
      "totalAmount": 41098.00,
      "createdAt": "2024-01-20T14:30:00.000Z",
      "store": {
        "name": "Tech Paradise Store",
        "slug": "tech-paradise"
      },
      "itemCount": 2
    },
    {
      "id": "order-uuid-456",
      "status": "DELIVERED",
      "totalAmount": 15990.00,
      "createdAt": "2024-01-15T09:00:00.000Z",
      "deliveredAt": "2024-01-17T14:30:00.000Z",
      "store": {
        "name": "Tech Paradise Store", 
        "slug": "tech-paradise"
      },
      "itemCount": 1
    }
  ],
  "pagination": {
    "total": 8,
    "offset": 0,
    "limit": 10,
    "hasMore": false
  }
}
```

---

### 5. Get Order Statistics

Get comprehensive order statistics with optional filters.

**Endpoint**: `GET /api/orders/stats`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| storeId | string | Store UUID to filter by |
| dateFrom | string | Date from (ISO string) |
| dateTo | string | Date to (ISO string) |

#### Request Examples
```bash
# Overall statistics
curl -X GET "http://localhost:3001/api/orders/stats" \
  -H "Authorization: Bearer <admin-token>"

# Store-specific statistics
curl -X GET "http://localhost:3001/api/orders/stats?storeId=tech-store-uuid" \
  -H "Authorization: Bearer <store-admin-token>"

# Date range statistics
curl -X GET "http://localhost:3001/api/orders/stats?dateFrom=2024-01-01T00:00:00.000Z&dateTo=2024-01-31T23:59:59.999Z" \
  -H "Authorization: Bearer <admin-token>"
```

#### Response
```json
{
  "period": {
    "from": "2024-01-01T00:00:00.000Z",
    "to": "2024-01-31T23:59:59.999Z",
    "storeId": "tech-store-uuid"
  },
  "totalOrders": 150,
  "pendingOrders": 12,
  "confirmedOrders": 120,
  "processingOrders": 8,
  "shippedOrders": 5,
  "deliveredOrders": 98,
  "cancelledOrders": 8,
  "returnedOrders": 2,
  "totalRevenue": 4500000.00,
  "averageOrderValue": 30000.00,
  "conversionRate": 88.67,
  "trends": {
    "dailyOrders": [
      {"date": "2024-01-01", "count": 5, "revenue": 150000.00},
      {"date": "2024-01-02", "count": 8, "revenue": 240000.00}
    ],
    "weeklyGrowth": 12.5,
    "monthlyGrowth": 25.3
  },
  "topProducts": [
    {
      "productId": "iphone-product-uuid",
      "productName": "iPhone 15 Pro",
      "orderCount": 45,
      "totalRevenue": 1795500.00
    }
  ]
}
```

---

### 6. Get Orders Needing Attention

Get orders with expired reservations or other issues requiring attention.

**Endpoint**: `GET /api/orders/attention`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/api/orders/attention" \
  -H "Authorization: Bearer <admin-token>"
```

#### Response
```json
{
  "expiredReservationOrders": [
    {
      "id": "order-uuid-expired-1",
      "status": "PENDING",
      "totalAmount": 3000.00,
      "createdAt": "2024-01-20T13:00:00.000Z",
      "reservationExpiredAt": "2024-01-20T14:00:00.000Z",
      "customer": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "store": {
        "name": "Tech Paradise Store",
        "slug": "tech-paradise"
      }
    }
  ],
  "longPendingOrders": [
    {
      "id": "order-uuid-long-1",
      "status": "PENDING",
      "totalAmount": 5000.00,
      "createdAt": "2024-01-18T10:00:00.000Z",
      "daysPending": 3,
      "customer": {
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    }
  ],
  "totalNeedingAttention": 5,
  "summary": {
    "expiredReservations": 3,
    "longPending": 2
  }
}
```

---

### 7. Get Order by ID

Get detailed order information including items and reservations.

**Endpoint**: `GET /api/orders/{orderId}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN, STORE_STAFF

#### Request
```bash
curl -X GET "http://localhost:3001/api/orders/order-uuid-123" \
  -H "Authorization: Bearer <token>"
```

#### Response
```json
{
  "id": "order-uuid-123",
  "status": "PENDING",
  "totalAmount": 41098.00,
  "notes": "Gift wrapping required",
  "createdAt": "2024-01-20T14:30:00.000Z",
  "confirmedAt": null,
  "customer": {
    "id": "customer-uuid-456",
    "name": "Alice Johnson",
    "phone": "+66-87-999-8888",
    "email": "alice@example.com",
    "address": {
      "street": "456 Tech Avenue",
      "city": "Bangkok",
      "province": "Bangkok",
      "postalCode": "10200",
      "country": "Thailand"
    }
  },
  "store": {
    "id": "tech-store-uuid",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise",
    "email": "info@techparadise.com",
    "phone": "+66-123-456-789"
  },
  "items": [
    {
      "id": "order-item-1",
      "quantity": 1,
      "unitPrice": 39900.00,
      "totalPrice": 39900.00,
      "product": {
        "id": "iphone-product-uuid",
        "name": "iPhone 15 Pro",
        "sku": "APL-IPH15P-256-BLK",
        "brand": {
          "name": "Apple",
          "slug": "apple",
          "logo": "https://example.com/apple-logo.png"
        }
      }
    },
    {
      "id": "order-item-2",
      "quantity": 2,
      "unitPrice": 599.00,
      "totalPrice": 1198.00,
      "product": {
        "id": "case-product-uuid",
        "name": "iPhone Case Pro",
        "sku": "CASE-IPH15P-001"
      }
    }
  ],
  "reservations": [
    {
      "id": "reservation-1",
      "productId": "iphone-product-uuid",
      "quantity": 1,
      "expiresAt": "2024-01-20T15:30:00.000Z",
      "status": "ACTIVE",
      "createdAt": "2024-01-20T14:30:00.000Z"
    },
    {
      "id": "reservation-2",
      "productId": "case-product-uuid",
      "quantity": 2,
      "expiresAt": "2024-01-20T15:30:00.000Z",
      "status": "ACTIVE",
      "createdAt": "2024-01-20T14:30:00.000Z"
    }
  ],
  "timeline": [
    {
      "status": "PENDING",
      "timestamp": "2024-01-20T14:30:00.000Z",
      "note": "Order created with stock reservation"
    }
  ]
}
```

---

### 8. Update Order Status

Update order status with automatic stock handling.

**Endpoint**: `PUT /api/orders/{orderId}/status`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request Body
```json
{
  "status": "CONFIRMED",
  "cancelReason": null
}
```

#### Status Transition Rules
| From | To | Description |
|------|----|-----------| 
| PENDING | CONFIRMED | Confirm order, convert reservations to allocations |
| PENDING | CANCELLED | Cancel order, release reservations |
| CONFIRMED | PROCESSING | Start processing order |
| PROCESSING | SHIPPED | Mark order as shipped |
| SHIPPED | DELIVERED | Mark order as delivered |
| Any | CANCELLED | Cancel order (with reason) |

#### Request Example
```bash
curl -X PUT "http://localhost:3001/api/orders/order-uuid-123/status" \
  -H "Authorization: Bearer <store-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED"
  }'
```

#### Success Response (200 OK)
```json
{
  "id": "order-uuid-123",
  "status": "CONFIRMED",
  "totalAmount": 41098.00,
  "confirmedAt": "2024-01-20T15:45:00.000Z",
  "customer": {
    "name": "Alice Johnson",
    "email": "alice@example.com"
  },
  "store": {
    "name": "Tech Paradise Store"
  },
  "stockUpdates": [
    {
      "productId": "iphone-product-uuid",
      "previousReserved": 1,
      "newAllocated": 1,
      "availableStock": 4
    }
  ],
  "timeline": [
    {
      "status": "PENDING",
      "timestamp": "2024-01-20T14:30:00.000Z",
      "note": "Order created"
    },
    {
      "status": "CONFIRMED",
      "timestamp": "2024-01-20T15:45:00.000Z", 
      "note": "Order confirmed by store admin"
    }
  ]
}
```

---

### 9. Cancel Order

Cancel order with automatic stock reservation release.

**Endpoint**: `POST /api/orders/{orderId}/cancel`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request Body
```json
{
  "reason": "Customer requested cancellation"
}
```

#### Request Example
```bash
curl -X POST "http://localhost:3001/api/orders/order-uuid-123/cancel" \
  -H "Authorization: Bearer <store-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Customer no longer needs the items"
  }'
```

#### Success Response (200 OK)
```json
{
  "id": "order-uuid-123",
  "status": "CANCELLED",
  "totalAmount": 41098.00,
  "cancelReason": "Customer no longer needs the items",
  "cancelledAt": "2024-01-20T16:00:00.000Z",
  "stockReleased": [
    {
      "productId": "iphone-product-uuid",
      "quantityReleased": 1,
      "newAvailableStock": 6
    },
    {
      "productId": "case-product-uuid",
      "quantityReleased": 2,
      "newAvailableStock": 25
    }
  ],
  "message": "Order cancelled successfully and stock released"
}
```

---

### 10. Cleanup Expired Orders

Automatically cancel orders with expired reservations (Admin only).

**Endpoint**: `POST /api/orders/cleanup-expired`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X POST "http://localhost:3001/api/orders/cleanup-expired" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json"
```

#### Success Response (200 OK)
```json
{
  "message": "Expired orders cleaned up successfully",
  "count": 7,
  "details": {
    "cancelledOrders": [
      "order-uuid-expired-1",
      "order-uuid-expired-2",
      "order-uuid-expired-3"
    ],
    "stockReleased": {
      "totalQuantity": 15,
      "productsAffected": 8
    }
  },
  "nextCleanupAt": "2024-01-20T17:00:00.000Z"
}
```

---

## Order Workflow

### 1. Standard Order Flow
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
```

### 2. Cancellation Flow
```
PENDING → CANCELLED (releases reservations)
CONFIRMED → CANCELLED (releases allocated stock)
```

### 3. Return Flow
```
DELIVERED → RETURNED (returns stock to inventory)
```

---

## Stock Reservation System

### Reservation Logic
1. **Order Creation**: Stock is reserved for specified duration
2. **Reservation Expiry**: Unreserved stock becomes available again
3. **Order Confirmation**: Reserved stock is allocated (permanent)
4. **Order Cancellation**: Reserved/allocated stock is released

### Reservation Status
- `ACTIVE`: Reservation is valid and active
- `EXPIRED`: Reservation has expired, stock released
- `CONFIRMED`: Reservation converted to allocation
- `CANCELLED`: Reservation manually cancelled

---

## Common Use Cases

### 1. Customer Places Order (Store Staff)
```bash
curl -X POST "http://localhost:3001/api/orders" \
  -H "Authorization: Bearer <store-staff-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "my-store-uuid",
    "customer": {
      "name": "John Customer",
      "phone": "+66-81-111-2222",
      "email": "john@customer.com",
      "address": {"street": "123 Main St", "city": "Bangkok", "postalCode": "10110", "country": "Thailand"}
    },
    "items": [
      {"productId": "product-uuid", "quantity": 1, "unitPrice": 1500.00}
    ]
  }'
```

### 2. Store Admin Confirms Order
```bash
curl -X PUT "http://localhost:3001/api/orders/order-uuid/status" \
  -H "Authorization: Bearer <store-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

### 3. Track Order Status
```bash
curl -X GET "http://localhost:3001/api/orders/order-uuid" \
  -H "Authorization: Bearer <token>"
```

### 4. Get Store Performance
```bash
curl -X GET "http://localhost:3001/api/orders/stats?storeId=store-uuid&dateFrom=2024-01-01T00:00:00.000Z" \
  -H "Authorization: Bearer <store-admin-token>"
```

---

## Error Handling

### Common Error Responses

#### 409 Conflict - Insufficient Stock
```json
{
  "statusCode": 409,
  "message": "Insufficient stock for requested items",
  "error": "Conflict",
  "details": {
    "insufficientItems": [
      {
        "productId": "product-uuid",
        "productName": "iPhone 15 Pro",
        "requested": 3,
        "available": 1
      }
    ]
  }
}
```

#### 400 Bad Request - Invalid Status Transition
```json
{
  "statusCode": 400,
  "message": "Cannot transition from DELIVERED to PENDING",
  "error": "Bad Request",
  "details": {
    "currentStatus": "DELIVERED",
    "requestedStatus": "PENDING",
    "allowedTransitions": ["RETURNED"]
  }
}
```

#### 404 Not Found - Order Not Found
```json
{
  "statusCode": 404,
  "message": "Order not found",
  "error": "Not Found"
}
```

---

## Notes

1. **Stock Reservations**: All orders automatically reserve stock for 60 minutes (configurable)
2. **Customer Records**: Customer information is stored for future orders
3. **Price Locking**: Unit prices are locked at order creation time
4. **Order Numbers**: System generates unique order numbers for customer reference
5. **Audit Trail**: All order status changes are logged with timestamps
6. **Background Cleanup**: Expired reservations are cleaned up automatically
7. **Store Isolation**: Store staff can only see orders for their store

---

## Testing Examples

### Complete Order Management Flow
```bash
# 1. Create order
ORDER_RESPONSE=$(curl -X POST "http://localhost:3001/api/orders" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"storeId": "store-uuid", "customer": {...}, "items": [...]}')

ORDER_ID=$(echo $ORDER_RESPONSE | jq -r '.id')

# 2. Check order status
curl -X GET "http://localhost:3001/api/orders/$ORDER_ID" \
  -H "Authorization: Bearer <token>"

# 3. Confirm order
curl -X PUT "http://localhost:3001/api/orders/$ORDER_ID/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'

# 4. Update to processing
curl -X PUT "http://localhost:3001/api/orders/$ORDER_ID/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "PROCESSING"}'

# 5. Mark as shipped
curl -X PUT "http://localhost:3001/api/orders/$ORDER_ID/status" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "SHIPPED"}'
```