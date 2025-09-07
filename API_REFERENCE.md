# 📚 Interlink Backend API Reference

**Base URL**: `http://localhost:3001/api`  
**Swagger Documentation**: http://localhost:3001/api/docs

---

## 🔐 Authentication Endpoints

### 1. User Login
**POST** `/auth/login`

Login และรับ JWT token สำหรับ authentication

**Request Body:**
```json
{
  "email": "admin@interlink.local",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1e7a9509-2354-4632-826e-263b983d7e8f",
    "email": "admin@interlink.local",
    "name": "System Admin",
    "role": "ADMIN",
    "storeId": null,
    "store": null
  }
}
```

**Store User Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "4e65dda0-868c-4c61-9dc3-8e5f6dda294e",
    "email": "store@interlink.local",
    "name": "Store Manager",
    "role": "STORE_ADMIN",
    "storeId": "e5e73f58-9ae2-44c6-afa0-a12914e7f66a",
    "store": {
      "id": "e5e73f58-9ae2-44c6-afa0-a12914e7f66a",
      "name": "Demo Store",
      "slug": "demo-store"
    }
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 2. Get User Profile
**GET** `/auth/profile`

ดึงข้อมูล profile ของ user ที่ login อยู่

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "user": {
    "id": "1e7a9509-2354-4632-826e-263b983d7e8f",
    "email": "admin@interlink.local",
    "name": "System Admin",
    "role": "ADMIN",
    "storeId": null,
    "isActive": true,
    "createdAt": "2025-09-07T05:33:09.085Z",
    "updatedAt": "2025-09-07T05:33:09.085Z",
    "store": null
  }
}
```

---

### 3. Refresh Token
**POST** `/auth/refresh`

สร้าง JWT token ใหม่ด้วย token เก่าที่ยังไม่หมดอายุ

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 👥 User Management Endpoints

### 1. Get User Profile
**GET** `/users/profile`

ดึงข้อมูล profile ของ user ปัจจุบัน (เหมือนกับ `/auth/profile`)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200):**
```json
{
  "id": "1e7a9509-2354-4632-826e-263b983d7e8f",
  "email": "admin@interlink.local",
  "name": "System Admin",
  "role": "ADMIN",
  "storeId": null,
  "isActive": true,
  "createdAt": "2025-09-07T05:33:09.085Z",
  "updatedAt": "2025-09-07T05:33:09.085Z",
  "store": null
}
```

---

### 2. Get All Users (Admin Only)
**GET** `/users`

ดึงข้อมูล users ทั้งหมดในระบบ (เฉพาะ Admin)

**Headers:**
```
Authorization: Bearer {admin_jwt_token}
```

**Required Role:** `ADMIN`

**Response (200):**
```json
[
  {
    "id": "4e65dda0-868c-4c61-9dc3-8e5f6dda294e",
    "email": "store@interlink.local",
    "name": "Store Manager",
    "role": "STORE_ADMIN",
    "storeId": "e5e73f58-9ae2-44c6-afa0-a12914e7f66a",
    "isActive": true,
    "createdAt": "2025-09-07T05:33:09.923Z",
    "updatedAt": "2025-09-07T05:33:09.923Z",
    "store": {
      "id": "e5e73f58-9ae2-44c6-afa0-a12914e7f66a",
      "name": "Demo Store",
      "slug": "demo-store",
      "description": "Sample store for development and testing",
      "email": "store@interlink.local",
      "phone": "02-123-4567",
      "address": {
        "city": "Bangkok",
        "street": "123 Demo Street", 
        "country": "TH",
        "postalCode": "10110"
      },
      "status": "ACTIVE",
      "subscriptionStatus": "ACTIVE"
    }
  },
  {
    "id": "1e7a9509-2354-4632-826e-263b983d7e8f",
    "email": "admin@interlink.local",
    "name": "System Admin",
    "role": "ADMIN",
    "storeId": null,
    "isActive": true,
    "store": null
  }
]
```

**Error Response (403) - Non-Admin User:**
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

### 3. Get Users by Store
**GET** `/users/store/{storeId}`

ดึงข้อมูล users ที่เป็นของร้านนี้ (Admin หรือ Store Admin)

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Required Role:** `ADMIN` หรือ `STORE_ADMIN`

**Parameters:**
- `storeId` (string): ID ของร้านค้า

**Response (200):**
```json
[
  {
    "id": "4e65dda0-868c-4c61-9dc3-8e5f6dda294e",
    "email": "store@interlink.local",
    "name": "Store Manager",
    "role": "STORE_ADMIN",
    "storeId": "e5e73f58-9ae2-44c6-afa0-a12914e7f66a",
    "isActive": true,
    "store": {
      "id": "e5e73f58-9ae2-44c6-afa0-a12914e7f66a",
      "name": "Demo Store",
      "slug": "demo-store"
    }
  }
]
```

---

### 4. Update User (Admin Only)
**PUT** `/users/{userId}`

อัพเดตข้อมูล user (เฉพาะ Admin)

**Headers:**
```
Authorization: Bearer {admin_jwt_token}
```

**Required Role:** `ADMIN`

**Parameters:**
- `userId` (string): ID ของ user ที่จะแก้ไข

**Request Body:**
```json
{
  "name": "Updated Name",
  "isActive": false,
  "role": "STORE_STAFF"
}
```

**Response (200):**
```json
{
  "id": "4e65dda0-868c-4c61-9dc3-8e5f6dda294e",
  "email": "store@interlink.local",
  "name": "Updated Name",
  "role": "STORE_STAFF",
  "isActive": false,
  "updatedAt": "2025-09-07T07:45:00.000Z"
}
```

---

## 🔍 System Endpoints

### 1. Health Check
**GET** `/health`

ตรวจสอบสถานะระบบ

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-09-07T07:45:00.000Z",
  "service": "Interlink Backend API",
  "version": "1.0.0",
  "environment": "development"
}
```

---

### 2. API Root
**GET** `/`

หน้าหลักของ API

**Response (200):**
```
Interlink Backend API is running! 🚀
```

---

## 🔑 Authentication & Authorization

### JWT Token
ระบบใช้ JWT (JSON Web Token) สำหรับ authentication:
- **Expiration**: 24 ชั่วโมง (configurable)
- **Algorithm**: HS256
- **Secret**: กำหนดใน environment variable `JWT_SECRET`

### User Roles (RBAC)
- **ADMIN**: สิทธิ์เต็มในการจัดการระบบ
- **STORE_ADMIN**: จัดการร้านค้าของตัวเอง
- **STORE_STAFF**: พนักงานร้านค้า (limited access)
- **SALE**: ทีมขาย (limited access)
- **CUSTOMER_GUEST**: ลูกค้าทั่วไป

### Error Responses

**401 Unauthorized:**
```json
{
  "message": "Unauthorized",
  "error": "Unauthorized", 
  "statusCode": 401
}
```

**403 Forbidden:**
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```

**400 Bad Request:**
```json
{
  "message": ["property email should not exist"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🧪 Development Data

### Test Users
1. **System Admin:**
   - Email: `admin@interlink.local`
   - Password: `admin123`
   - Role: `ADMIN`

2. **Store Manager:**
   - Email: `store@interlink.local`
   - Password: `admin123`
   - Role: `STORE_ADMIN`
   - Store: Demo Store

### Development Services
- **API Server**: http://localhost:3001
- **Swagger UI**: http://localhost:3001/api/docs
- **Prisma Studio**: http://localhost:5555
- **Adminer (DB UI)**: http://localhost:8080
- **MailHog**: http://localhost:8025

---

## 📝 Usage Examples

### cURL Examples

**Login as Admin:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "admin123"}'
```

**Get Profile with Token:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3001/api/auth/profile
```

**Get All Users (Admin only):**
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  http://localhost:3001/api/users
```

### JavaScript/Fetch Examples

**Login:**
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@interlink.local',
    password: 'admin123'
  })
});

const data = await response.json();
const token = data.access_token;
```

**Authenticated Request:**
```javascript
const response = await fetch('http://localhost:3001/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const users = await response.json();
```

---

## 🚀 Coming Soon (In Development)

ระบบที่กำลังพัฒนาต่อใน Phase 3:

- **Brand Management APIs** (`/api/brands`)
- **Store Management APIs** (`/api/stores`)
- **Product Management APIs** (`/api/products`)
- **Stock Management APIs** (`/api/stocks`)
- **Order Management APIs** (`/api/orders`)
- **Store Product Creation APIs** (`/api/store-products`)
- **Permission Management APIs** (`/api/permissions`)

---

*Last Updated: 2025-09-07 - Phase 2 Authentication Complete*  
*API Status: ✅ Authentication & User Management Ready*