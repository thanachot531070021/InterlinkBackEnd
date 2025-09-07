# 🎭 Authorization & RBAC Testing

การทดสอบระบบ Authorization และ Role-Based Access Control (RBAC) ของ Interlink Backend API

## 📋 User Roles ในระบบ

- **ADMIN** - ผู้ดูแลระบบ (สิทธิ์เต็ม)
- **STORE_ADMIN** - ผู้ดูแลร้านค้า
- **STORE_STAFF** - พนักงานร้านค้า
- **SALE** - ทีมขาย
- **CUSTOMER_GUEST** - ลูกค้าทั่วไป

## 🧪 รายการทดสอบ

### 1. 👑 Admin Role Tests

#### Test Case 1.1: Admin Access to All Users
**Objective:** ทดสอบ Admin สามารถเข้าถึงข้อมูล users ทั้งหมดได้
**Method:** GET `/api/users`
**Required Role:** ADMIN only

**Pre-requisite:** Login as Admin first
```bash
# Step 1: Get Admin Token
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "admin123"}' \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
```

**Test Command:**
```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3001/api/users
```

**Expected Result:**
```json
[
  {
    "id": "4e65dda0-868c-4c61-9dc3-8e5f6dda294e",
    "email": "store@interlink.local",
    "name": "Store Manager",
    "role": "STORE_ADMIN",
    "storeId": "e5e73f58-9ae2-44c6-afa0-a12914e7f66a",
    "isActive": true,
    "store": {...}
  },
  {
    "id": "1e7a9509-2354-4632-826e-263b983d7e8f",
    "email": "admin@interlink.local", 
    "name": "System Admin",
    "role": "ADMIN",
    "isActive": true
  }
]
```
- ✅ Status Code: 200
- ✅ Returns all users with full details
- ✅ Admin has access

---

#### Test Case 1.2: Admin Update User
**Objective:** ทดสอบ Admin สามารถแก้ไขข้อมูล user ได้
**Method:** PUT `/api/users/{userId}`
**Required Role:** ADMIN only

**Test Command:**
```bash
curl -X PUT -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "isActive": false}' \
  http://localhost:3001/api/users/4e65dda0-868c-4c61-9dc3-8e5f6dda294e
```

**Expected Result:**
```json
{
  "id": "4e65dda0-868c-4c61-9dc3-8e5f6dda294e",
  "email": "store@interlink.local",
  "name": "Updated Name",
  "role": "STORE_ADMIN",
  "isActive": false,
  "updatedAt": "2025-09-07T07:45:00.000Z"
}
```
- ✅ Status Code: 200
- ✅ User updated successfully
- ✅ Admin can modify users

---

### 2. 🏪 Store Admin Role Tests

#### Test Case 2.1: Store Admin Blocked from Admin Endpoints
**Objective:** ทดสอบ Store Admin ไม่สามารถเข้าถึง admin-only endpoints ได้
**Method:** GET `/api/users`
**Blocked Role:** STORE_ADMIN

**Pre-requisite:** Login as Store Admin
```bash
# Step 1: Get Store Admin Token  
STORE_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "store@interlink.local", "password": "admin123"}' \
  | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
```

**Test Command:**
```bash
curl -H "Authorization: Bearer $STORE_TOKEN" \
  http://localhost:3001/api/users
```

**Expected Result:**
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden",
  "statusCode": 403
}
```
- ✅ Status Code: 403 Forbidden
- ✅ Access denied to admin endpoint
- ✅ RBAC working correctly

---

#### Test Case 2.2: Store Admin Access to Own Store Users
**Objective:** ทดสอบ Store Admin สามารถเข้าถึงข้อมูล users ในร้านของตัวเองได้
**Method:** GET `/api/users/store/{storeId}`
**Required Role:** STORE_ADMIN or ADMIN

**Test Command:**
```bash
curl -H "Authorization: Bearer $STORE_TOKEN" \
  http://localhost:3001/api/users/store/e5e73f58-9ae2-44c6-afa0-a12914e7f66a
```

**Expected Result:**
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
- ✅ Status Code: 200
- ✅ Returns store-specific users
- ✅ Store Admin has limited access

---

#### Test Case 2.3: Store Admin Cannot Update Users
**Objective:** ทดสอบ Store Admin ไม่สามารถแก้ไขข้อมูล user ได้
**Method:** PUT `/api/users/{userId}`
**Blocked Role:** STORE_ADMIN

**Test Command:**
```bash
curl -X PUT -H "Authorization: Bearer $STORE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Hacked Name"}' \
  http://localhost:3001/api/users/1e7a9509-2354-4632-826e-263b983d7e8f
```

**Expected Result:**
```json
{
  "message": "Forbidden resource", 
  "error": "Forbidden",
  "statusCode": 403
}
```
- ✅ Status Code: 403 Forbidden
- ✅ Store Admin cannot modify users
- ✅ Admin-only operation protected

---

### 3. 🔒 JWT Authentication Guard Tests

#### Test Case 3.1: Access Protected Endpoint without Token
**Objective:** ทดสอบการเข้าถึง protected endpoint โดยไม่มี JWT token
**Method:** GET `/api/users/profile`

**Test Command:**
```bash
curl http://localhost:3001/api/users/profile
```

**Expected Result:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
- ✅ Status Code: 401 Unauthorized
- ✅ Access denied without authentication

---

#### Test Case 3.2: Access with Expired/Invalid Token
**Objective:** ทดสอบการเข้าถึงด้วย JWT token ที่ไม่ถูกต้อง
**Method:** GET `/api/users/profile`

**Test Command:**
```bash
curl -H "Authorization: Bearer invalid-jwt-token" \
  http://localhost:3001/api/users/profile
```

**Expected Result:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
- ✅ Status Code: 401 Unauthorized
- ✅ Invalid token rejected

---

### 4. 🚫 Cross-Role Access Tests

#### Test Case 4.1: Store Admin Accessing Other Store Data
**Objective:** ทดสอบ Store Admin ไม่สามารถเข้าถึงข้อมูลร้านอื่นได้
**Method:** GET `/api/users/store/{otherStoreId}`

**Test Command:**
```bash
# Using fake store ID
curl -H "Authorization: Bearer $STORE_TOKEN" \
  http://localhost:3001/api/users/store/fake-store-id-12345
```

**Expected Result:**
```json
[]
```
หรือ
```json
{
  "message": "Forbidden resource",
  "error": "Forbidden", 
  "statusCode": 403
}
```
- ✅ Status Code: 200 (empty array) หรือ 403
- ✅ Cannot access other store data

---

## 📊 RBAC Matrix

| Endpoint | Admin | Store Admin | Store Staff | Sale | Customer |
|----------|-------|-------------|-------------|------|----------|
| GET `/api/users` | ✅ Allow | ❌ Deny | ❌ Deny | ❌ Deny | ❌ Deny |
| PUT `/api/users/{id}` | ✅ Allow | ❌ Deny | ❌ Deny | ❌ Deny | ❌ Deny |
| GET `/api/users/profile` | ✅ Allow | ✅ Allow | ✅ Allow | ✅ Allow | ✅ Allow |
| GET `/api/users/store/{id}` | ✅ Allow | ✅ Own Store | ❌ Deny | ❌ Deny | ❌ Deny |
| GET `/api/auth/profile` | ✅ Allow | ✅ Allow | ✅ Allow | ✅ Allow | ✅ Allow |
| POST `/api/auth/refresh` | ✅ Allow | ✅ Allow | ✅ Allow | ✅ Allow | ✅ Allow |

---

## 📋 Test Results Template

### Test Execution Date: ________________
### Tester: ____________________________

| Test Case | Status | Response Time | Notes |
|-----------|--------|---------------|-------|
| 1.1 Admin All Users Access | ⭕ Pass / ❌ Fail | _____ ms | |
| 1.2 Admin Update User | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.1 Store Admin Blocked | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.2 Store Admin Own Store | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.3 Store Admin Update Blocked | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.1 No Token Access | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.2 Invalid Token Access | ⭕ Pass / ❌ Fail | _____ ms | |
| 4.1 Cross-Store Access | ⭕ Pass / ❌ Fail | _____ ms | |

### Overall RBAC System Status:
- ⭕ **PASS** - Authorization system working correctly
- ❌ **FAIL** - Security vulnerabilities found

### Security Issues Found:
```
List any unauthorized access or privilege escalation issues
```

### RBAC Violations:
```
Document any cases where roles have incorrect permissions
```

---

*Test Suite Version: 1.0*  
*Last Updated: 2025-09-07*