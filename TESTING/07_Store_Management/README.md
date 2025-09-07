# 🏪 Store Management API Testing

การทดสอบ Store Management APIs สำหรับระบบจัดการร้านค้า

## 📋 Test Cases Overview

รวม **12 test cases** สำหรับ Store Management:

### 🔐 Authentication & Authorization Tests
1. **SM_AUTH_01** - Admin create store (should succeed)
2. **SM_AUTH_02** - Store user create another store (should fail)
3. **SM_AUTH_03** - Store admin access own store stats (should succeed)
4. **SM_AUTH_04** - Store user access other store data (should fail)

### 📊 CRUD Operations Tests
5. **SM_CRUD_01** - Create store with valid data
6. **SM_CRUD_02** - Get all stores list (Admin only)
7. **SM_CRUD_03** - Get store by ID with relationships
8. **SM_CRUD_04** - Update store information
9. **SM_CRUD_05** - Get store by slug
10. **SM_CRUD_06** - Get store statistics
11. **SM_CRUD_07** - Get store brand entitlements
12. **SM_CRUD_08** - Get active stores only

---

## 🧪 Detailed Test Cases

### SM_AUTH_01: Admin Create Store
**Purpose**: ทดสอบว่า Admin สามารถสร้าง store ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/stores" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Electronics Store",
    "slug": "test-electronics",
    "description": "A test electronics store",
    "email": "store@test.com",
    "phone": "+66-123-456-789",
    "address": {
      "street": "123 Test Street",
      "city": "Bangkok",
      "province": "Bangkok",
      "postalCode": "10110",
      "country": "Thailand"
    },
    "logo": "https://example.com/store-logo.png"
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response: Store object with generated ID
- Default status: `ACTIVE`
- Default subscriptionStatus: `TRIAL`

---

### SM_AUTH_02: Store User Create Store (Should Fail)
**Purpose**: ทดสอบว่า Store user ไม่สามารถสร้าง store ใหม่ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/stores" \
  -H "Authorization: Bearer ${STORE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unauthorized Store",
    "slug": "unauthorized-store",
    "email": "unauthorized@test.com"
  }'
```

**Expected Result**:
- Status: `403 Forbidden`
- Response: Error message about insufficient permissions

---

### SM_AUTH_03: Store Admin Access Own Store Stats
**Purpose**: ทดสอบว่า Store Admin สามารถดูสถิติร้านตนเองได้

**Request**:
```bash
curl -X GET "http://localhost:3001/api/stores/{storeId}/stats" \
  -H "Authorization: Bearer ${STORE_ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Store statistics with detailed metrics
- Only if storeId matches user's store

---

### SM_CRUD_01: Create Store with Valid Data
**Purpose**: ทดสอบการสร้าง store ด้วยข้อมูลครบถ้วน

**Request**:
```bash
curl -X POST "http://localhost:3001/api/stores" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bangkok Electronics",
    "slug": "bangkok-electronics",
    "description": "Premium electronics store in Bangkok",
    "email": "info@bangkokelectronics.com",
    "phone": "+66-2-123-4567",
    "address": {
      "street": "456 Sukhumvit Road",
      "city": "Bangkok",
      "province": "Bangkok",
      "postalCode": "10110",
      "country": "Thailand"
    },
    "status": "ACTIVE",
    "subscriptionStatus": "ACTIVE"
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response contains all provided fields
- UUID generated for ID
- Timestamps auto-generated

---

### SM_CRUD_02: Get All Stores (Admin Only)
**Purpose**: ทดสอบการดึงรายการ stores ทั้งหมด (Admin เท่านั้น)

**Request**:
```bash
curl -X GET "http://localhost:3001/api/stores" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of all stores
- Ordered by `createdAt DESC`
- Admin-only access

---

### SM_CRUD_03: Get Store by ID with Relationships
**Purpose**: ทดสอบการดึงข้อมูล store พร้อม relationships

**Request**:
```bash
curl -X GET "http://localhost:3001/api/stores/{storeId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response includes:
  - Store basic info
  - `users` array (up to 10 recent users)
  - `entitlements` array (up to 10 brand entitlements with brand info)

---

### SM_CRUD_04: Update Store Information
**Purpose**: ทดสอบการแก้ไขข้อมูล store

**Request**:
```bash
curl -X PATCH "http://localhost:3001/api/stores/{storeId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated premium electronics store",
    "phone": "+66-2-987-6543",
    "status": "ACTIVE"
  }'
```

**Expected Result**:
- Status: `200 OK`
- Response: Updated store object
- Only specified fields changed

---

### SM_CRUD_05: Get Store by Slug
**Purpose**: ทดสอบการค้นหา store ด้วย slug

**Request**:
```bash
curl -X GET "http://localhost:3001/api/stores/slug/bangkok-electronics" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Store with active entitlements only
- Entitlements filtered by `effectiveTo: null`

---

### SM_CRUD_06: Get Store Statistics
**Purpose**: ทดสอบการดึงสถิติของ store

**Request**:
```bash
curl -X GET "http://localhost:3001/api/stores/{storeId}/stats" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response includes:
  - Store basic info
  - `stats.totalUsers` - จำนวน users ทั้งหมด
  - `stats.activeUsers` - จำนวน users ที่ active
  - `stats.totalBrandEntitlements` - สิทธิ์แบรนด์ทั้งหมด
  - `stats.activeBrandEntitlements` - สิทธิ์แบรนด์ที่ active
  - `stats.totalProducts` - จำนวนสินค้าในสต๊อก
  - `stats.totalOrders` - จำนวน orders ทั้งหมด

---

### SM_CRUD_07: Get Store Brand Entitlements
**Purpose**: ทดสอบการดึงสิทธิ์แบรนด์ของ store

**Request**:
```bash
curl -X GET "http://localhost:3001/api/stores/{storeId}/brands" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of active entitlements with brand info
- Filtered by `effectiveTo: null`
- Ordered by `effectiveFrom DESC`

---

### SM_CRUD_08: Get Active Stores Only
**Purpose**: ทดสอบการดึงร้านค้าที่ active เท่านั้น

**Request**:
```bash
curl -X GET "http://localhost:3001/api/stores/active" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of stores with `status: 'ACTIVE'`
- Ordered by `name ASC`

---

## ❌ Error Testing

### Invalid Data Tests:
- Empty name (should return 400)
- Invalid email format (should return 400)
- Invalid slug format (should return 400)
- Duplicate slug (should return 400/409)

### Not Found Tests:
- Get non-existent store ID (should return 404)
- Get non-existent slug (should return 404)
- Update non-existent store (should return 404)

### Authorization Tests:
- Store user accessing other stores (should return 403)
- Non-admin accessing admin-only endpoints (should return 403)

---

## 📊 Expected Results Summary

| Test Case | Status | Auth Required | Expected Response |
|-----------|--------|---------------|-------------------|
| SM_AUTH_01 | 201 | Admin | Store created |
| SM_AUTH_02 | 403 | Store | Forbidden |
| SM_AUTH_03 | 200 | Store Admin | Own store stats |
| SM_AUTH_04 | 403 | Store | Forbidden |
| SM_CRUD_01 | 201 | Admin | Store object |
| SM_CRUD_02 | 200 | Admin | Stores array |
| SM_CRUD_03 | 200 | Any | Store + relationships |
| SM_CRUD_04 | 200 | Admin/Store Admin | Updated store |
| SM_CRUD_05 | 200 | Any | Store by slug |
| SM_CRUD_06 | 200 | Admin/Store Admin | Store statistics |
| SM_CRUD_07 | 200 | Any | Brand entitlements |
| SM_CRUD_08 | 200 | Any | Active stores |

---

*Last Updated: 2025-09-07*  
*Status: 🏪 Store Management API Tests Ready*