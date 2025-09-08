# Authentication APIs

## Overview

Authentication APIs handle user login, token management, and profile access. The system uses JWT (JSON Web Tokens) for authentication with Bearer token authorization.

**Base URL**: `/auth`

---

## Endpoints

### 1. User Login

Authenticate a user and receive an access token.

**Endpoint**: `POST /auth/login`  
**Authorization**: Not required  
**Rate Limit**: 10 requests per minute per IP

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | User password (minimum 6 characters) |

#### Request Example
```bash
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@interlink.local",
    "password": "admin123"
  }'
```

#### Success Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@interlink.local",
    "name": "System Administrator",
    "role": "ADMIN",
    "storeId": null,
    "store": null
  }
}
```

#### Error Responses
```json
// 401 Unauthorized - Invalid Credentials
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}

// 400 Bad Request - Validation Error
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}

// 423 Locked - Account Disabled
{
  "statusCode": 423,
  "message": "Account is disabled. Please contact administrator.",
  "error": "Locked"
}
```

#### Store User Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "email": "store@example.com",
    "name": "Store Owner",
    "role": "STORE_ADMIN",
    "storeId": "store-uuid-here",
    "store": {
      "id": "store-uuid-here",
      "name": "My Store",
      "slug": "my-store"
    }
  }
}
```

---

### 2. Get User Profile

Retrieve the profile of the currently authenticated user.

**Endpoint**: `GET /auth/profile`  
**Authorization**: Bearer Token Required  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X GET "http://localhost:3001/auth/profile" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Success Response (200 OK)
```json
{
  "user": {
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
}
```

#### Error Responses
```json
// 401 Unauthorized - Invalid/Expired Token
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

### 3. Refresh Access Token

Generate a new access token using the current valid token.

**Endpoint**: `POST /auth/refresh`  
**Authorization**: Bearer Token Required  
**Role Required**: Any authenticated user

#### Request
```bash
curl -X POST "http://localhost:3001/auth/refresh" \
  -H "Authorization: Bearer <your-current-jwt-token>" \
  -H "Content-Type: application/json"
```

#### Success Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.NEW_TOKEN_SIGNATURE"
}
```

#### Error Responses
```json
// 401 Unauthorized - Invalid Token
{
  "statusCode": 401,
  "message": "Token is invalid or expired",
  "error": "Unauthorized"
}
```

---

## User Roles & Access Levels

### Role Descriptions

| Role | Description | Typical Use Case |
|------|-------------|------------------|
| `ADMIN` | System administrator | Full system access, user management |
| `STORE_ADMIN` | Store owner/manager | Store management, staff oversight |
| `STORE_STAFF` | Store employee | Limited store operations |
| `SALE` | Sales representative | Sales tracking, customer interaction |
| `CUSTOMER_GUEST` | Customer/Guest user | Shopping, order placement |

### Permission Matrix

| Feature | ADMIN | STORE_ADMIN | STORE_STAFF | SALE | CUSTOMER_GUEST |
|---------|--------|-------------|-------------|------|----------------|
| User Management | ✅ | ⚠️ (Store only) | ❌ | ❌ | ❌ |
| Store Management | ✅ | ✅ (Own store) | ❌ | ❌ | ❌ |
| Product Management | ✅ | ✅ | ⚠️ (Limited) | ❌ | ❌ |
| Order Management | ✅ | ✅ | ✅ | ⚠️ (View only) | ⚠️ (Own orders) |
| Storefront Access | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## JWT Token Details

### Token Structure
```
Header: {"alg": "HS256", "typ": "JWT"}
Payload: {
  "sub": "user-id",
  "email": "user@example.com",
  "role": "STORE_ADMIN",
  "storeId": "store-id-if-applicable",
  "iat": 1516239022,
  "exp": 1516325422
}
```

### Token Expiration
- **Default**: 24 hours
- **Configurable**: Via JWT_EXPIRES_IN environment variable
- **Refresh**: Use `/auth/refresh` endpoint before expiration

### Token Security
- Tokens are stateless and cannot be revoked server-side
- Keep tokens secure and never expose in URLs or logs
- Use HTTPS in production to prevent token interception

---

## Authentication Flow Examples

### 1. Basic Login Flow
```bash
# Step 1: Login
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Response: {"access_token": "eyJ...", "user": {...}}

# Step 2: Use token for authenticated requests
curl -X GET "http://localhost:3001/users/profile" \
  -H "Authorization: Bearer eyJ..."
```

### 2. Token Refresh Flow
```bash
# When token is about to expire, refresh it
curl -X POST "http://localhost:3001/auth/refresh" \
  -H "Authorization: Bearer <current-token>"

# Response: {"access_token": "new-token-here"}
```

### 3. Admin Login Example
```bash
# Admin login
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@interlink.local",
    "password": "admin123"
  }'

# Expected Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-uuid",
    "email": "admin@interlink.local",
    "name": "System Administrator",
    "role": "ADMIN",
    "storeId": null,
    "store": null
  }
}
```

### 4. Store Admin Login Example
```bash
# Store admin login
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "store@interlink.local",
    "password": "store123"
  }'

# Expected Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "store-user-uuid",
    "email": "store@interlink.local", 
    "name": "Store Administrator",
    "role": "STORE_ADMIN",
    "storeId": "store-uuid",
    "store": {
      "id": "store-uuid",
      "name": "Demo Store",
      "slug": "demo-store"
    }
  }
}
```

---

## Security Best Practices

### 1. Token Storage
- **Frontend**: Store in secure, httpOnly cookies or secure localStorage
- **Mobile**: Use secure keychain/keystore
- **Never**: Store in plain text files or URL parameters

### 2. Token Transmission
- Always use HTTPS in production
- Include tokens in Authorization header: `Bearer <token>`
- Never include tokens in URL parameters

### 3. Token Validation
- Check token expiration before making requests
- Implement automatic token refresh
- Handle 401 responses gracefully with re-authentication

### 4. Rate Limiting
- Login endpoint: 10 requests per minute per IP
- Refresh endpoint: 100 requests per hour per user
- Use exponential backoff for failed attempts

---

## Common Error Scenarios

### Invalid Credentials
```bash
# Wrong password
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "wrongpassword"}'

# Response: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

### Malformed Request
```bash
# Missing required fields
curl -X POST "http://localhost:3001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Response: 400 Bad Request
{
  "statusCode": 400,
  "message": ["password should not be empty"],
  "error": "Bad Request"
}
```

### Expired Token
```bash
# Using expired token
curl -X GET "http://localhost:3001/auth/profile" \
  -H "Authorization: Bearer <expired-token>"

# Response: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Token has expired",
  "error": "Unauthorized"
}
```

---

## Testing Accounts

### Default Test Accounts
```json
// System Administrator
{
  "email": "admin@interlink.local",
  "password": "admin123",
  "role": "ADMIN"
}

// Store Administrator  
{
  "email": "store@interlink.local",
  "password": "store123",
  "role": "STORE_ADMIN"
}

// Store Staff
{
  "email": "staff@interlink.local",
  "password": "staff123",
  "role": "STORE_STAFF"
}
```

### Environment Variables
```bash
# Authentication Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Rate Limiting
LOGIN_RATE_LIMIT=10
LOGIN_RATE_WINDOW=60000

# Security
BCRYPT_ROUNDS=12
```