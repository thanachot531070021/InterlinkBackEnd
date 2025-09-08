# User Management APIs

## Overview

User Management APIs handle all user-related operations including creating, updating, deleting, and searching users. These APIs are primarily restricted to ADMIN users only.

**Base URL**: `/users`

## Authentication Required

All endpoints require JWT authentication with appropriate roles.

---

## Endpoints

### 1. Get Current User Profile

Retrieve the profile of the currently authenticated user.

**Endpoint**: `GET /users/profile`  
**Authorization**: Bearer Token (Any authenticated user)  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/users/profile" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "STORE_ADMIN",
  "storeId": "456e7890-e89b-12d3-a456-426614174001",
  "isActive": true,
  "hasEnabledTwoFactor": false,
  "createdAt": "2024-01-15T08:30:00.000Z",
  "updatedAt": "2024-01-20T10:15:00.000Z",
  "store": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "My Store",
    "slug": "my-store"
  }
}
```

---

### 2. Create New User (Admin Only)

Create a new user account. Only ADMIN users can create new users.

**Endpoint**: `POST /users`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request Body
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "name": "Jane Smith",
  "role": "STORE_ADMIN",
  "storeId": "456e7890-e89b-12d3-a456-426614174001"
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Minimum 6 characters |
| name | string | Yes | User's full name |
| role | enum | Yes | User role: ADMIN, STORE_ADMIN, STORE_STAFF, SALE, CUSTOMER_GUEST |
| storeId | string | No | Required for store-related roles |

#### Request Example
```bash
curl -X POST "http://localhost:3001/users" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "storemanager@example.com",
    "password": "password123",
    "name": "Store Manager",
    "role": "STORE_ADMIN",
    "storeId": "456e7890-e89b-12d3-a456-426614174001"
  }'
```

#### Success Response (201 Created)
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "email": "storemanager@example.com",
  "name": "Store Manager",
  "role": "STORE_ADMIN",
  "storeId": "456e7890-e89b-12d3-a456-426614174001",
  "isActive": true,
  "hasEnabledTwoFactor": false,
  "createdAt": "2024-01-20T14:30:00.000Z",
  "updatedAt": "2024-01-20T14:30:00.000Z",
  "store": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "My Store",
    "slug": "my-store"
  }
}
```

#### Error Responses
```json
// 400 Bad Request - Validation Error
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}

// 409 Conflict - Email Already Exists
{
  "statusCode": 409,
  "message": "User with this email already exists",
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

### 3. Get All Users (Admin Only)

Retrieve a list of all users in the system.

**Endpoint**: `GET /users`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/users" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Response
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "admin@example.com",
      "name": "System Admin",
      "role": "ADMIN",
      "storeId": null,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "store": null
    },
    {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "email": "store@example.com",
      "name": "Store Owner",
      "role": "STORE_ADMIN",
      "storeId": "store-uuid",
      "isActive": true,
      "createdAt": "2024-01-10T10:00:00.000Z",
      "store": {
        "id": "store-uuid",
        "name": "Example Store",
        "slug": "example-store"
      }
    }
  ],
  "count": 2
}
```

---

### 4. Search Users (Admin Only)

Search and filter users with various criteria.

**Endpoint**: `GET /users/search`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| query | string | Search in name and email |
| role | enum | Filter by role |
| storeId | string | Filter by store ID |
| isActive | boolean | Filter by active status |

#### Request Examples
```bash
# Search by name/email
curl -X GET "http://localhost:3001/users/search?query=john" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Filter by role
curl -X GET "http://localhost:3001/users/search?role=STORE_ADMIN" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Filter by store
curl -X GET "http://localhost:3001/users/search?storeId=456e7890-e89b-12d3-a456-426614174001" \
  -H "Authorization: Bearer <admin-jwt-token>"

# Multiple filters
curl -X GET "http://localhost:3001/users/search?role=STORE_ADMIN&isActive=true" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Response
```json
{
  "data": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "STORE_ADMIN",
      "storeId": "456e7890-e89b-12d3-a456-426614174001",
      "isActive": true,
      "createdAt": "2024-01-15T08:30:00.000Z",
      "store": {
        "name": "Example Store",
        "slug": "example-store"
      }
    }
  ],
  "count": 1,
  "filters": {
    "query": "john",
    "role": null,
    "storeId": null,
    "isActive": null
  }
}
```

---

### 5. Get User Statistics (Admin Only)

Get system-wide user statistics.

**Endpoint**: `GET /users/stats`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/users/stats" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Response
```json
{
  "total": 150,
  "active": 142,
  "inactive": 8,
  "byRole": {
    "ADMIN": 2,
    "STORE_ADMIN": 45,
    "STORE_STAFF": 78,
    "SALE": 15,
    "CUSTOMER_GUEST": 10
  },
  "recentRegistrations": {
    "last7Days": 8,
    "last30Days": 23
  },
  "twoFactorEnabled": 67
}
```

---

### 6. Get Users by Store (Store Admin Only)

Retrieve all users associated with a specific store.

**Endpoint**: `GET /users/store/{storeId}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/users/store/456e7890-e89b-12d3-a456-426614174001" \
  -H "Authorization: Bearer <store-admin-jwt-token>"
```

#### Response
```json
{
  "data": [
    {
      "id": "user1-uuid",
      "email": "manager@store.com",
      "name": "Store Manager",
      "role": "STORE_ADMIN",
      "isActive": true,
      "createdAt": "2024-01-10T10:00:00.000Z"
    },
    {
      "id": "user2-uuid",
      "email": "staff@store.com",
      "name": "Store Staff",
      "role": "STORE_STAFF",
      "isActive": true,
      "createdAt": "2024-01-15T14:00:00.000Z"
    }
  ],
  "store": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "Example Store",
    "slug": "example-store"
  },
  "count": 2
}
```

---

### 7. Get User by ID

Retrieve a specific user by their ID.

**Endpoint**: `GET /users/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN, STORE_ADMIN

#### Request
```bash
curl -X GET "http://localhost:3001/users/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "STORE_ADMIN",
  "storeId": "456e7890-e89b-12d3-a456-426614174001",
  "isActive": true,
  "hasEnabledTwoFactor": true,
  "createdAt": "2024-01-15T08:30:00.000Z",
  "updatedAt": "2024-01-20T10:15:00.000Z",
  "store": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "name": "My Store",
    "slug": "my-store"
  }
}
```

---

### 8. Update User (Admin Only)

Update user information.

**Endpoint**: `PUT /users/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request Body
```json
{
  "name": "Updated Name",
  "isActive": false,
  "role": "STORE_STAFF",
  "storeId": "new-store-id"
}
```

#### Request Example
```bash
curl -X PUT "http://localhost:3001/users/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Updated",
    "isActive": true,
    "role": "STORE_ADMIN"
  }'
```

#### Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Smith Updated",
  "role": "STORE_ADMIN",
  "storeId": "456e7890-e89b-12d3-a456-426614174001",
  "isActive": true,
  "updatedAt": "2024-01-20T15:30:00.000Z"
}
```

---

### 9. Delete User (Admin Only)

Delete a user from the system.

**Endpoint**: `DELETE /users/{id}`  
**Authorization**: Bearer Token  
**Role Required**: ADMIN

#### Request
```bash
curl -X DELETE "http://localhost:3001/users/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer <admin-jwt-token>"
```

#### Success Response (200 OK)
```json
{
  "message": "User deleted successfully",
  "deletedUserId": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### Error Response
```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

---

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

#### 422 Validation Error
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "error": "Unprocessable Entity",
  "details": {
    "email": ["must be a valid email"],
    "password": ["must be at least 6 characters"]
  }
}
```

---

## Notes

1. **Password Security**: Passwords are automatically hashed using bcrypt before storage
2. **Email Uniqueness**: Email addresses must be unique across the system
3. **Role Hierarchy**: ADMIN users have access to all user operations
4. **Store Association**: Users with store-related roles must be associated with a valid store
5. **Audit Trail**: All user modifications are logged for security purposes

---

## Testing Examples

### Create Admin User
```bash
curl -X POST "http://localhost:3001/users" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "admin123456",
    "name": "New Admin User",
    "role": "ADMIN"
  }'
```

### Create Store Manager
```bash
curl -X POST "http://localhost:3001/users" \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@mystore.com",
    "password": "manager123",
    "name": "Store Manager",
    "role": "STORE_ADMIN",
    "storeId": "your-store-uuid"
  }'
```