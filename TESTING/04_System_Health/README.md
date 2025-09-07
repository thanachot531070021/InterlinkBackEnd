# 🔍 System Health Testing

การทดสอบสุขภาพและเสถียรภาพของ Interlink Backend System

## 🎯 วัตถุประสงค์

ทดสอบว่าระบบทำงานได้อย่างเสถียรและพร้อมให้บริการ:
- API Server availability
- Database connectivity
- Response times
- Error handling
- System resources

## 🧪 รายการทดสอบ

### 1. ⚡ API Server Health Tests

#### Test Case 1.1: Health Check Endpoint
**Objective:** ทดสอบ health check endpoint พื้นฐาน
**Method:** GET `/api/health`

**Test Command:**
```bash
curl http://localhost:3001/api/health
```

**Expected Result:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-07T07:45:00.000Z",
  "service": "Interlink Backend API",
  "version": "1.0.0",
  "environment": "development"
}
```
- ✅ Status Code: 200
- ✅ Response time: < 100ms
- ✅ Status: "ok"
- ✅ Includes timestamp and version

---

#### Test Case 1.2: API Root Endpoint
**Objective:** ทดสอบ API root endpoint
**Method:** GET `/api`

**Test Command:**
```bash
curl http://localhost:3001/api
```

**Expected Result:**
```
Interlink Backend API is running! 🚀
```
- ✅ Status Code: 200
- ✅ Response time: < 50ms
- ✅ Message indicates server running

---

### 2. 🗄️ Database Health Tests

#### Test Case 2.1: Database Connection via API
**Objective:** ทดสอบการเชื่อมต่อ database ผ่าน API
**Method:** GET `/api/users` (requires auth)

**Pre-requisite:** Get admin token
```bash
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
- ✅ Status Code: 200
- ✅ Response time: < 500ms
- ✅ Returns user data from database
- ✅ No database connection errors

---

#### Test Case 2.2: Prisma Studio Access
**Objective:** ทดสอบการเข้าถึง Prisma Studio
**Method:** GET http://localhost:5555

**Test Command:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5555
```

**Expected Result:**
- ✅ Status Code: 200
- ✅ Prisma Studio accessible
- ✅ Database management UI available

---

### 3. 📊 Performance Tests

#### Test Case 3.1: Response Time Test
**Objective:** ทดสอบ response time ของ API endpoints
**Method:** Multiple requests with timing

**Test Command:**
```bash
# Test login endpoint response time
time curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "admin123"}' \
  -w "Response Time: %{time_total}s\n"
```

**Expected Result:**
- ✅ Login response time: < 1000ms
- ✅ Health check response time: < 100ms
- ✅ User listing response time: < 500ms
- ✅ No timeouts

---

#### Test Case 3.2: Concurrent Request Test
**Objective:** ทดสอบการรับ concurrent requests
**Method:** Multiple simultaneous requests

**Test Command:**
```bash
# Send 10 concurrent health check requests
for i in {1..10}; do
  curl http://localhost:3001/api/health &
done
wait
```

**Expected Result:**
- ✅ All requests return 200
- ✅ No errors or timeouts
- ✅ Server handles concurrent load
- ✅ Response times remain acceptable

---

### 4. 📄 Documentation Tests

#### Test Case 4.1: Swagger Documentation
**Objective:** ทดสอบการเข้าถึง Swagger API documentation
**Method:** GET `/api/docs`

**Test Command:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/docs
```

**Expected Result:**
- ✅ Status Code: 200
- ✅ Swagger UI loads successfully
- ✅ API endpoints documented
- ✅ Try-it-out functionality works

---

### 5. 🔧 Development Services Tests

#### Test Case 5.1: Adminer Database UI
**Objective:** ทดสอบการเข้าถึง Adminer database management
**Method:** GET http://localhost:8080

**Test Command:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080
```

**Expected Result:**
- ✅ Status Code: 200
- ✅ Adminer login page accessible
- ✅ Can connect to PostgreSQL database
- ✅ Database tables visible

---

#### Test Case 5.2: MailHog Email Testing
**Objective:** ทดสอบการเข้าถึง MailHog email testing service
**Method:** GET http://localhost:8025

**Test Command:**
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8025
```

**Expected Result:**
- ✅ Status Code: 200
- ✅ MailHog UI accessible
- ✅ Ready for email testing
- ✅ SMTP service available

---

### 6. ⚠️ Error Handling Tests

#### Test Case 6.1: Non-Existent Endpoint
**Objective:** ทดสอบการ handle endpoint ที่ไม่มี
**Method:** GET `/api/nonexistent`

**Test Command:**
```bash
curl http://localhost:3001/api/nonexistent
```

**Expected Result:**
```json
{
  "statusCode": 404,
  "message": "Cannot GET /api/nonexistent",
  "error": "Not Found"
}
```
- ✅ Status Code: 404 Not Found
- ✅ Proper error response format
- ✅ Clear error message

---

#### Test Case 6.2: Invalid HTTP Method
**Objective:** ทดสอบการ handle HTTP method ที่ไม่ถูกต้อง
**Method:** PUT `/api/health`

**Test Command:**
```bash
curl -X PUT http://localhost:3001/api/health
```

**Expected Result:**
```json
{
  "statusCode": 405,
  "message": "Method Not Allowed",
  "error": "Method Not Allowed"
}
```
- ✅ Status Code: 405 Method Not Allowed
- ✅ Proper error handling

---

### 7. 🌐 CORS Tests

#### Test Case 7.1: CORS Headers
**Objective:** ทดสอบ CORS headers สำหรับ cross-origin requests
**Method:** OPTIONS `/api/auth/login`

**Test Command:**
```bash
curl -X OPTIONS http://localhost:3001/api/auth/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected Result:**
- ✅ Access-Control-Allow-Origin header present
- ✅ Access-Control-Allow-Methods header present  
- ✅ Access-Control-Allow-Headers header present
- ✅ CORS properly configured

---

## 📊 System Requirements Checklist

| Component | Status | Port | Notes |
|-----------|--------|------|-------|
| **NestJS API Server** | ⭕ Up / ❌ Down | 3001 | Main application |
| **PostgreSQL Database** | ⭕ Up / ❌ Down | 5432 | Primary database |
| **Prisma Studio** | ⭕ Up / ❌ Down | 5555 | Database UI |
| **Adminer** | ⭕ Up / ❌ Down | 8080 | DB management |
| **MailHog** | ⭕ Up / ❌ Down | 8025 | Email testing |
| **Redis** | ⭕ Up / ❌ Down | 6379 | Caching (optional) |

---

## 📋 Test Results Template

### Test Execution Date: ________________
### Tester: ____________________________
### Environment: _______________________

| Test Case | Status | Response Time | Notes |
|-----------|--------|---------------|-------|
| 1.1 Health Check | ⭕ Pass / ❌ Fail | _____ ms | |
| 1.2 API Root | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.1 Database via API | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.2 Prisma Studio | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.1 Response Times | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.2 Concurrent Requests | ⭕ Pass / ❌ Fail | _____ ms | |
| 4.1 Swagger Docs | ⭕ Pass / ❌ Fail | _____ ms | |
| 5.1 Adminer UI | ⭕ Pass / ❌ Fail | _____ ms | |
| 5.2 MailHog UI | ⭕ Pass / ❌ Fail | _____ ms | |
| 6.1 404 Handling | ⭕ Pass / ❌ Fail | _____ ms | |
| 6.2 405 Handling | ⭕ Pass / ❌ Fail | _____ ms | |
| 7.1 CORS Headers | ⭕ Pass / ❌ Fail | _____ ms | |

### Overall System Health Status:
- ⭕ **HEALTHY** - All systems operational
- ⚠️ **DEGRADED** - Some issues but functional
- ❌ **UNHEALTHY** - Critical issues requiring attention

### Performance Metrics:
- Average Response Time: _____ ms
- Maximum Response Time: _____ ms
- Success Rate: _____%

### Issues Found:
```
List any system health issues, performance problems, or service unavailability
```

### Resource Usage:
```
CPU, Memory, Disk, Network usage if monitored
```

---

*Test Suite Version: 1.0*  
*Last Updated: 2025-09-07*