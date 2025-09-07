# 🔐 Authentication Testing

การทดสอบระบบ Authentication ของ Interlink Backend API

## 📋 รายการทดสอบ

### 1. 🎯 Login Success Tests

#### Test Case 1.1: Admin User Login
**Objective:** ทดสอบการ login ของ Admin user
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1e7a9509-2354-4632-826e-263b983d7e8f",
    "email": "admin@interlink.local",
    "name": "System Admin",
    "role": "ADMIN"
  }
}
```
- ✅ Status Code: 200
- ✅ JWT token returned
- ✅ User role: ADMIN

---

#### Test Case 1.2: Store User Login
**Objective:** ทดสอบการ login ของ Store user
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "store@interlink.local", "password": "admin123"}'
```

**Expected Result:**
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
- ✅ Status Code: 200
- ✅ JWT token returned
- ✅ User role: STORE_ADMIN
- ✅ Store information included

---

### 2. ❌ Login Failure Tests

#### Test Case 2.1: Invalid Password
**Objective:** ทดสอบการ login ด้วยรหัสผ่านผิด
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "wrongpassword"}'
```

**Expected Result:**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```
- ✅ Status Code: 401
- ✅ Error message: "Invalid credentials"

---

#### Test Case 2.2: Non-Existent User
**Objective:** ทดสอบการ login ด้วย email ที่ไม่มีในระบบ
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "nonexistent@example.com", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized", 
  "statusCode": 401
}
```
- ✅ Status Code: 401
- ✅ Error message: "Invalid credentials"

---

### 3. 🛡️ JWT Token Tests

#### Test Case 3.1: Profile Access with Valid Token
**Objective:** ทดสอบการเข้าถึง profile ด้วย JWT token ที่ถูกต้อง
**Method:** GET `/api/auth/profile`

**Test Command:**
```bash
curl -H "Authorization: Bearer {JWT_TOKEN}" \
  http://localhost:3001/api/auth/profile
```

**Expected Result:**
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
- ✅ Status Code: 200
- ✅ User profile returned
- ✅ Complete user information

---

#### Test Case 3.2: Profile Access without Token
**Objective:** ทดสอบการเข้าถึง profile โดยไม่มี JWT token
**Method:** GET `/api/auth/profile`

**Test Command:**
```bash
curl http://localhost:3001/api/auth/profile
```

**Expected Result:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
- ✅ Status Code: 401
- ✅ Access denied

---

#### Test Case 3.3: Profile Access with Invalid Token
**Objective:** ทดสอบการเข้าถึง profile ด้วย JWT token ที่ไม่ถูกต้อง
**Method:** GET `/api/auth/profile`

**Test Command:**
```bash
curl -H "Authorization: Bearer invalid-token-123" \
  http://localhost:3001/api/auth/profile
```

**Expected Result:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
- ✅ Status Code: 401
- ✅ Access denied

---

### 4. 🔄 Token Refresh Tests

#### Test Case 4.1: Token Refresh
**Objective:** ทดสอบการสร้าง JWT token ใหม่
**Method:** POST `/api/auth/refresh`

**Test Command:**
```bash
curl -X POST -H "Authorization: Bearer {VALID_JWT_TOKEN}" \
  http://localhost:3001/api/auth/refresh
```

**Expected Result:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- ✅ Status Code: 200
- ✅ New JWT token returned
- ✅ Token expiry updated

---

## 📊 Test Results Template

### Test Execution Date: ________________
### Tester: ____________________________

| Test Case | Status | Response Time | Notes |
|-----------|--------|---------------|-------|
| 1.1 Admin Login | ⭕ Pass / ❌ Fail | _____ ms | |
| 1.2 Store Login | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.1 Invalid Password | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.2 Non-Existent User | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.1 Valid Token Access | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.2 No Token Access | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.3 Invalid Token Access | ⭕ Pass / ❌ Fail | _____ ms | |
| 4.1 Token Refresh | ⭕ Pass / ❌ Fail | _____ ms | |

### Overall Authentication System Status:
- ⭕ **PASS** - All tests passed, system secure
- ❌ **FAIL** - Issues found, requires attention

### Issues Found:
```
List any issues, bugs, or security concerns discovered during testing
```

### Recommendations:
```
Suggestions for improvements or fixes
```

---

*Test Suite Version: 1.0*  
*Last Updated: 2025-09-07*