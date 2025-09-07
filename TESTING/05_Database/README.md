# 🗄️ Database Testing

การทดสอบ Database และ Data Integrity ของ Interlink Backend System

## 🎯 วัตถุประสงค์

ทดสอบการทำงานของ database และความถูกต้องของข้อมูล:
- Database connection และ availability
- Data integrity และ constraints
- CRUD operations
- Relationships และ foreign keys
- Seed data accuracy

## 🧪 รายการทดสอบ

### 1. 🔗 Database Connection Tests

#### Test Case 1.1: PostgreSQL Connection
**Objective:** ทดสอบการเชื่อมต่อ PostgreSQL database
**Method:** Direct connection test

**Test Command:**
```bash
# Test via Prisma Studio availability
curl -s -o /dev/null -w "%{http_code}" http://localhost:5555
```

**Test via Adminer:**
- URL: http://localhost:8080
- Server: `db`
- Username: `postgres`
- Password: `postgres123`  
- Database: `interlink`

**Expected Result:**
- ✅ Status Code: 200 (Prisma Studio)
- ✅ Adminer login successful
- ✅ Database `interlink` accessible
- ✅ No connection errors

---

### 2. 📊 Seed Data Verification Tests

#### Test Case 2.1: Admin User Data
**Objective:** ทดสอบ seed data ของ admin user
**Method:** Query via API

**Test Command:**
```bash
# Login as admin first
ADMIN_TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@interlink.local", "password": "admin123"}' \
  | jq -r '.access_token')

# Get all users to verify admin exists
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:3001/api/users | jq '.'
```

**Expected Result:**
```json
[
  {
    "id": "1e7a9509-2354-4632-826e-263b983d7e8f",
    "email": "admin@interlink.local",
    "name": "System Admin",
    "role": "ADMIN",
    "storeId": null,
    "isActive": true
  }
]
```
- ✅ Admin user exists
- ✅ Email: `admin@interlink.local`
- ✅ Role: `ADMIN`
- ✅ isActive: `true`

---

#### Test Case 2.2: Store User Data
**Objective:** ทดสอบ seed data ของ store user
**Method:** Check store user in result from above

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
- ✅ Store user exists
- ✅ Email: `store@interlink.local`
- ✅ Role: `STORE_ADMIN`
- ✅ Connected to Demo Store

---

#### Test Case 2.3: Brand Data Verification
**Objective:** ทดสอบ seed data ของ brands
**Method:** Direct database query via Prisma Studio

**Via Prisma Studio (http://localhost:5555):**
1. เปิด `Brand` table
2. ตรวจสอบข้อมูล

**Expected Result:**
- ✅ **Tech Gadgets** brand exists
  - slug: `tech-gadgets`  
  - isActive: `true`
- ✅ **Fashion Style** brand exists
  - slug: `fashion-style`
  - isActive: `true`

---

#### Test Case 2.4: Store Data Verification
**Objective:** ทดสอบ seed data ของ stores
**Method:** Direct database query

**Via Prisma Studio:**
1. เปิด `Store` table
2. ตรวจสอบข้อมูล

**Expected Result:**
- ✅ **Demo Store** exists
  - slug: `demo-store`
  - status: `ACTIVE`
  - subscriptionStatus: `ACTIVE`
  - email: `store@interlink.local`
  - phone: `02-123-4567`

---

#### Test Case 2.5: Product Data Verification
**Objective:** ทดสอบ seed data ของ products
**Method:** Direct database query

**Via Prisma Studio:**
1. เปิด `Product` table
2. ตรวจสอบข้อมูล

**Expected Result:**
- ✅ **iPhone 15 Pro** exists
  - slug: `iphone-15-pro`
  - sku: `IP15P-001`
  - price: `35000`
- ✅ **MacBook Air M3** exists  
  - slug: `macbook-air-m3`
  - sku: `MBA-M3-001`
  - price: `42000`
- ✅ **Designer Handbag** exists
  - slug: `designer-handbag`
  - sku: `BAG-001`
  - price: `2500`

---

### 3. 🔗 Relationship Tests

#### Test Case 3.1: User-Store Relationship
**Objective:** ทดสอบ relationship ระหว่าง User และ Store
**Method:** Query with relationships

**Via Prisma Studio:**
1. เปิด `User` table
2. ดู relationships ไปยัง `Store`

**Expected Result:**
- ✅ Store user linked to Demo Store
- ✅ Admin user has no store (storeId: null)
- ✅ Foreign key constraints working

---

#### Test Case 3.2: Store-Brand Entitlements
**Objective:** ทดสอบ StoreBrandEntitlement relationships
**Method:** Direct database query

**Via Prisma Studio:**
1. เปิด `StoreBrandEntitlement` table
2. ตรวจสอบ relationships

**Expected Result:**
- ✅ Demo Store entitled to Tech Gadgets brand
  - pricingMode: `CENTRAL`
- ✅ Demo Store entitled to Fashion Style brand
  - pricingMode: `STORE`
- ✅ effectiveFrom dates are valid

---

#### Test Case 3.3: Store Product Permissions
**Objective:** ทดสอบ StoreProductPermission data
**Method:** Direct database query

**Via Prisma Studio:**
1. เปิด `StoreProductPermission` table
2. ตรวจสอบข้อมูล

**Expected Result:**
- ✅ Demo Store permission for Tech Gadgets brand
  - canCreateProducts: `true`
  - requiresApproval: `true`
  - maxProductsPerMonth: `10`
  - allowedCategories: `["Electronics", "Gadgets", "Accessories"]`

---

### 4. 💾 Data Integrity Tests

#### Test Case 4.1: Password Encryption
**Objective:** ทดสอบการ encrypt รหัสผ่าน
**Method:** Direct database query

**Via Prisma Studio:**
1. เปิด `User` table
2. ตรวจสอบ password field

**Expected Result:**
- ✅ Passwords are hashed (bcrypt)
- ✅ No plain text passwords
- ✅ Hash format: `$2b$10$...`

---

#### Test Case 4.2: UUID Generation
**Objective:** ทดสอบการสร้าง UUID สำหรับ primary keys
**Method:** Direct database query

**Via Prisma Studio:**
1. ตรวจสอบ id fields ในทุก table

**Expected Result:**
- ✅ All IDs are valid UUIDs
- ✅ No duplicate IDs
- ✅ Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

#### Test Case 4.3: Timestamp Fields
**Objective:** ทดสอบ timestamp fields (createdAt, updatedAt)
**Method:** Direct database query

**Via Prisma Studio:**
1. ตรวจสอบ timestamp fields

**Expected Result:**
- ✅ createdAt fields populated
- ✅ updatedAt fields populated  
- ✅ Timestamps are reasonable (recent dates)
- ✅ ISO 8601 format

---

### 5. 🔍 Stock Data Tests

#### Test Case 5.1: Store Stock Data
**Objective:** ทดสอบ StoreStock seed data
**Method:** Direct database query

**Via Prisma Studio:**
1. เปิด `StoreStock` table
2. ตรวจสอบข้อมูล

**Expected Result:**
- ✅ Stock records for all seeded products
- ✅ availableQty: `10` for each product
- ✅ priceCentral matches product prices
- ✅ priceStore calculated correctly for Fashion items (20% markup)

---

### 6. 🧪 Database Schema Tests

#### Test Case 6.1: Table Existence
**Objective:** ทดสอบว่า tables ทั้งหมดถูกสร้างแล้ว
**Method:** Database schema inspection

**Via Adminer:**
1. เข้าไป database `interlink`
2. ตรวจสอบ table list

**Expected Tables:**
- ✅ User
- ✅ Store  
- ✅ Brand
- ✅ Product
- ✅ ProductVariant
- ✅ StoreStock
- ✅ StoreBrandEntitlement
- ✅ StoreProductPermission
- ✅ ProductApprovalQueue
- ✅ Order
- ✅ OrderItem
- ✅ Reservation
- ✅ Customer
- ✅ Subscription
- ✅ Payment
- ✅ EventsAudit

---

#### Test Case 6.2: Index Verification
**Objective:** ทดสอบ database indexes
**Method:** Database schema inspection

**Via Adminer:**
1. ตรวจสอบ indexes ในแต่ละ table
2. ดู performance optimization

**Expected Indexes:**
- ✅ Primary key indexes (id fields)
- ✅ Unique indexes (email, slug fields)
- ✅ Foreign key indexes
- ✅ Composite indexes for frequently queried combinations

---

## 📊 Database Statistics

| Table | Expected Records | Actual Records | Status |
|-------|------------------|----------------|---------|
| User | 2 | _____ | ⭕ Pass / ❌ Fail |
| Store | 1 | _____ | ⭕ Pass / ❌ Fail |
| Brand | 2 | _____ | ⭕ Pass / ❌ Fail |
| Product | 3 | _____ | ⭕ Pass / ❌ Fail |
| StoreStock | 3 | _____ | ⭕ Pass / ❌ Fail |
| StoreBrandEntitlement | 2 | _____ | ⭕ Pass / ❌ Fail |
| StoreProductPermission | 1 | _____ | ⭕ Pass / ❌ Fail |
| Customer | 1 | _____ | ⭕ Pass / ❌ Fail |

---

## 📋 Test Results Template

### Test Execution Date: ________________
### Tester: ____________________________
### Database Version: ___________________

| Test Case | Status | Query Time | Notes |
|-----------|--------|------------|-------|
| 1.1 PostgreSQL Connection | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.1 Admin User Data | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.2 Store User Data | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.3 Brand Data | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.4 Store Data | ⭕ Pass / ❌ Fail | _____ ms | |
| 2.5 Product Data | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.1 User-Store Relationships | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.2 Store-Brand Entitlements | ⭕ Pass / ❌ Fail | _____ ms | |
| 3.3 Store Product Permissions | ⭕ Pass / ❌ Fail | _____ ms | |
| 4.1 Password Encryption | ⭕ Pass / ❌ Fail | _____ ms | |
| 4.2 UUID Generation | ⭕ Pass / ❌ Fail | _____ ms | |
| 4.3 Timestamp Fields | ⭕ Pass / ❌ Fail | _____ ms | |
| 5.1 Store Stock Data | ⭕ Pass / ❌ Fail | _____ ms | |
| 6.1 Table Existence | ⭕ Pass / ❌ Fail | _____ ms | |
| 6.2 Index Verification | ⭕ Pass / ❌ Fail | _____ ms | |

### Overall Database Status:
- ⭕ **HEALTHY** - All data intact and consistent
- ⚠️ **DEGRADED** - Some data issues but functional
- ❌ **CORRUPTED** - Critical data integrity problems

### Data Quality Issues:
```
List any missing data, incorrect relationships, or data corruption
```

### Performance Notes:
```
Query performance observations and optimization suggestions
```

---

*Test Suite Version: 1.0*  
*Last Updated: 2025-09-07*