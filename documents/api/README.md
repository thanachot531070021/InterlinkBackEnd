# Interlink API Documentation

## Overview

Welcome to the Interlink System API documentation. This system is a B2B platform that connects brands, stores, and customers with comprehensive inventory and order management capabilities.

## Base URL
```
Production: https://api.interlink.local
Development: http://localhost:3001
```

## Authentication

All API endpoints (except public storefront APIs) require JWT authentication using Bearer tokens.

### Headers Required:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## User Roles & Permissions

| Role | Description | Access Level |
|------|-------------|--------------|
| `ADMIN` | System administrator | Full system access |
| `STORE_ADMIN` | Store owner/manager | Store-specific management |
| `STORE_STAFF` | Store employee | Limited store access |
| `SALE` | Sales representative | Sales-specific access |
| `CUSTOMER_GUEST` | Customer/Guest user | Public storefront access |

## API Modules (95+ Total Endpoints)

### 🔐 Authentication & Security
1. **[Authentication APIs](./01_authentication.md)** - Login, profile management, JWT tokens (4 APIs)
2. **[Two-Factor Authentication APIs](./11_two_factor.md)** - 2FA/TOTP setup and verification (6+ APIs)
3. **[Social Login APIs](./12_social_login.md)** - Google/Facebook OAuth integration (5+ APIs)

### 👥 User & Access Management  
4. **[User Management APIs](./02_users.md)** - User CRUD operations (Admin only) (5 APIs)
5. **[Entitlements APIs](./06_entitlements.md)** - Store-Brand permissions (11 APIs)

### 🏪 Business Logic Management
6. **[Brand Management APIs](./04_brands.md)** - Brand operations and management (7 APIs)
7. **[Store Management APIs](./03_stores.md)** - Store operations and management (8 APIs)
8. **[Product Management APIs](./05_products.md)** - Product catalog management (11 APIs)

### 📊 Operations & Inventory
9. **[Stock Management APIs](./07_stock.md)** - Inventory operations with reservations (14+ APIs)
10. **[Order Management APIs](./08_orders.md)** - Order processing and customer management (16+ APIs)

### 🌍 Public & Customer APIs
11. **[🆕 Public Guest APIs](./13_public_apis.md)** - **NEW!** Browse products without login (8 APIs)
12. **[Storefront APIs](./09_storefront.md)** - Store-specific customer APIs (4 APIs)

### 📁 File Management
13. **[File Upload APIs](./10_uploads.md)** - File handling and configurable storage (2 APIs)

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "statusCode": 400
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Pagination

For endpoints that return lists, pagination is supported:

### Query Parameters:
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

### Response Format:
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

## Search & Filtering

Many endpoints support search and filtering:

### Common Query Parameters:
- `search`: Text search
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`
- `status`: Filter by status
- `brandId`: Filter by brand
- `storeId`: Filter by store

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **General APIs**: 1000 requests per hour per IP
- **Authentication APIs**: 10 requests per minute per IP
- **Upload APIs**: 50 requests per hour per user

## Testing

Use the following test accounts:

### Admin Account
```json
{
  "email": "admin@interlink.local",
  "password": "admin123"
}
```

### Store Admin Account
```json
{
  "email": "store@interlink.local", 
  "password": "store123"
}
```

## Postman Collection

Import our Postman collection for easy API testing:
- [Download Postman Collection](./postman/interlink-api.json)

## Environment Variables

For local development:
```bash
# API Base URL
API_BASE_URL=http://localhost:3001

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/interlink

# File Storage
STORAGE_TYPE=local
UPLOAD_PATH=./uploads
```

## Support

For API support and questions:
- Email: dev@interlink.local
- Documentation: https://docs.interlink.local
- GitHub Issues: https://github.com/interlink/backend/issues