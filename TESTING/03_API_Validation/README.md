# 📊 API Validation Testing

การทดสอบ Input Validation และ Data Validation ของ Interlink Backend API

## 🎯 วัตถุประสงค์

ทดสอบว่า API สามารถ validate input data ได้อย่างถูกต้องและปลอดภัย:
- Email format validation
- Password strength requirements
- Required field validation
- Data type validation
- SQL injection protection
- XSS protection

## 🧪 รายการทดสอบ

### 1. 📧 Email Validation Tests

#### Test Case 1.1: Invalid Email Format
**Objective:** ทดสอบการ validate รูปแบบ email ที่ผิด
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": ["email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Error message: "email must be an email"

---

#### Test Case 1.2: Empty Email Field
**Objective:** ทดสอบการ validate email field ที่ว่าง
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": ["email should not be empty", "email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Multiple validation errors

---

#### Test Case 1.3: Missing Email Field
**Objective:** ทดสอบการ validate เมื่อไม่มี email field
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": ["email should not be empty", "email must be an email"],
  "error": "Bad Request", 
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Required field validation

---

### 2. 🔐 Password Validation Tests

#### Test Case 2.1: Short Password
**Objective:** ทดสอบการ validate รหัสผ่านที่สั้นเกินไป
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "123"}'
```

**Expected Result:**
```json
{
  "message": ["password must be longer than or equal to 6 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Password length validation

---

#### Test Case 2.2: Empty Password
**Objective:** ทดสอบการ validate password field ที่ว่าง
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": ""}'
```

**Expected Result:**
```json
{
  "message": ["password should not be empty", "password must be longer than or equal to 6 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Multiple password validation errors

---

#### Test Case 2.3: Missing Password Field
**Objective:** ทดสอบการ validate เมื่อไม่มี password field
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local"}'
```

**Expected Result:**
```json
{
  "message": ["password should not be empty", "password must be longer than or equal to 6 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Required field validation

---

### 3. 🚫 Forbidden Fields Tests

#### Test Case 3.1: Extra Fields in Request
**Objective:** ทดสอบการ handle extra fields ที่ไม่ต้องการ
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "admin123", "role": "ADMIN", "isActive": true}'
```

**Expected Result:**
```json
{
  "message": ["property role should not exist", "property isActive should not exist"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Forbidden fields rejected
- ✅ Security protection against field injection

---

### 4. 🔍 Data Type Validation Tests

#### Test Case 4.1: Wrong Data Types
**Objective:** ทดสอบการ validate data types ที่ผิด
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": 12345, "password": true}'
```

**Expected Result:**
```json
{
  "message": ["email must be a string", "email must be an email", "password must be a string"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Data type validation working

---

### 5. 🛡️ Security Tests

#### Test Case 5.1: SQL Injection Attempt
**Objective:** ทดสอบการป้องกัน SQL injection
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local'\'' OR 1=1 --", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```
- ✅ Status Code: 401 Unauthorized
- ✅ SQL injection blocked
- ✅ No database compromise

---

#### Test Case 5.2: XSS Script Injection
**Objective:** ทดสอบการป้องกัน XSS attacks
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "<script>alert(\"XSS\")</script>@example.com", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": ["email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ XSS script rejected by email validation
- ✅ Input sanitization working

---

#### Test Case 5.3: Long String Attack
**Objective:** ทดสอบการป้องกัน buffer overflow/long string attacks
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "'$(printf 'A%.0s' {1..10000})'@example.com", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": ["email must be an email"],
  "error": "Bad Request",
  "statusCode": 400
}
```
หรือ
```json
{
  "message": "Request entity too large",
  "error": "Bad Request",
  "statusCode": 413
}
```
- ✅ Status Code: 400 หรือ 413
- ✅ Long string attack prevented

---

### 6. 📄 Content-Type Validation Tests

#### Test Case 6.1: Wrong Content-Type
**Objective:** ทดสอบการ validate Content-Type header
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: text/plain" \
  -d '{"email": "admin@interlink.local", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": "Invalid JSON format",
  "error": "Bad Request",
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Content-Type validation

---

#### Test Case 6.2: Missing Content-Type
**Objective:** ทดสอบการ handle request ที่ไม่มี Content-Type
**Method:** POST `/api/auth/login`

**Test Command:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -d '{"email": "admin@interlink.local", "password": "admin123"}'
```

**Expected Result:**
```json
{
  "message": "Invalid JSON format",
  "error": "Bad Request", 
  "statusCode": 400
}
```
- ✅ Status Code: 400 Bad Request
- ✅ Missing Content-Type handled

---

## 📊 Validation Rules Summary

| Field | Rules | Error Messages |
|-------|-------|----------------|
| **email** | - Required<br>- Must be valid email format<br>- String type | - "email should not be empty"<br>- "email must be an email" |
| **password** | - Required<br>- Minimum 6 characters<br>- String type | - "password should not be empty"<br>- "password must be longer than or equal to 6 characters" |
| **Extra Fields** | - Not allowed (whitelist) | - "property {field} should not exist" |
| **Content-Type** | - Must be application/json | - "Invalid JSON format" |

---

## 📋 Test Results Template

### Test Execution Date: ________________
### Tester: ____________________________

| Test Case | Status | Response Time | Notes |
|-----------|--------|---------------|-------|
| 1.1 Invalid Email Format | ⭕ Pass / ❌ Fail | _____ ms | |
| 1.2 Empty Email | ⭕ Pass / ❌ Fail | _____ ms | |
| 1.3 Missing Email | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.1 Short Password | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.2 Empty Password | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.3 Missing Password | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.1 Extra Fields | ⭕ Pass / ❌ Fail | _____ ms | |
| 4.1 Wrong Data Types | ⭕ Pass / ❌ Fail | _____ ms | |
| 5.1 SQL Injection | ⭕ Pass / ❌ Fail | _____ ms | |
| 5.2 XSS Injection | ⭕ Pass / ❌ Fail | _____ ms | |
| 5.3 Long String Attack | ⭕ Pass / ❌ Fail | _____ ms | |
| 6.1 Wrong Content-Type | ⭕ Pass / ❌ Fail | _____ ms | |
| 6.2 Missing Content-Type | ⭕ Pass / ❌ Fail | _____ ms | |

### Overall API Validation Status:
- ⭕ **PASS** - Input validation secure and working
- ❌ **FAIL** - Security vulnerabilities in validation

### Security Vulnerabilities Found:
```
List any validation bypasses or injection vulnerabilities
```

### Validation Issues:
```
Document cases where invalid data was accepted
```

---

*Test Suite Version: 1.0*  
*Last Updated: 2025-09-07*