# 🔗 Store-Brand Entitlements API Testing

การทดสอบ Store-Brand Entitlement APIs สำหรับระบบจัดการสิทธิ์ระหว่างร้านค้าและแบรนด์

## 📋 Test Cases Overview

รวม **12 test cases** สำหรับ Store-Brand Entitlements:

### 🔐 Authentication & Authorization Tests
1. **SE_AUTH_01** - Admin create entitlement (should succeed)
2. **SE_AUTH_02** - Store user create entitlement (should fail)
3. **SE_AUTH_03** - Admin revoke entitlement (should succeed)
4. **SE_AUTH_04** - Store user access entitlement stats (should fail)

### 📊 CRUD Operations Tests
5. **SE_CRUD_01** - Create entitlement with valid data
6. **SE_CRUD_02** - Get all entitlements (Admin only)
7. **SE_CRUD_03** - Get entitlement by ID
8. **SE_CRUD_04** - Update entitlement information
9. **SE_CRUD_05** - Get store entitlements
10. **SE_CRUD_06** - Get brand entitlements (Admin only)

### 🎯 Business Logic Tests
11. **SE_LOGIC_01** - Check entitlement access
12. **SE_LOGIC_02** - Get entitlement statistics

---

## 🧪 Detailed Test Cases

### SE_AUTH_01: Admin Create Entitlement
**Purpose**: ทดสอบว่า Admin สามารถสร้าง store-brand entitlement ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/entitlements" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "uuid-of-store",
    "brandId": "uuid-of-brand",
    "pricingMode": "CENTRAL",
    "effectiveFrom": "2025-01-01T00:00:00.000Z",
    "effectiveTo": "2025-12-31T23:59:59.999Z"
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response: Entitlement object with store and brand relationships
- Default pricingMode: `CENTRAL`

---

### SE_AUTH_02: Store User Create Entitlement (Should Fail)
**Purpose**: ทดสอบว่า Store user ไม่สามารถสร้าง entitlement ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/entitlements" \
  -H "Authorization: Bearer ${STORE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "uuid-of-store",
    "brandId": "uuid-of-brand"
  }'
```

**Expected Result**:
- Status: `403 Forbidden`
- Response: Error about insufficient permissions

---

### SE_CRUD_01: Create Entitlement with Valid Data
**Purpose**: ทดสอบการสร้าง entitlement ด้วยข้อมูลครบถ้วน

**Request**:
```bash
curl -X POST "http://localhost:3001/api/entitlements" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "uuid-of-electronics-store",
    "brandId": "uuid-of-apple-brand",
    "pricingMode": "STORE",
    "effectiveFrom": "2025-01-15T00:00:00.000Z"
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response includes store and brand details
- effectiveTo defaults to null (permanent)
- effectiveFrom defaults to now if not provided

---

### SE_CRUD_02: Get All Entitlements (Admin Only)
**Purpose**: ทดสอบการดึงรายการ entitlements ทั้งหมด (Admin เท่านั้น)

**Request**:
```bash
curl -X GET "http://localhost:3001/api/entitlements" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of all entitlements with store and brand info
- Ordered by `createdAt DESC`
- Admin-only access

---

### SE_CRUD_03: Get Entitlement by ID
**Purpose**: ทดสอบการดึงข้อมูล entitlement ตาม ID

**Request**:
```bash
curl -X GET "http://localhost:3001/api/entitlements/{entitlementId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Entitlement with full store and brand relationships
- Complete entitlement details

---

### SE_CRUD_04: Update Entitlement Information
**Purpose**: ทดสอบการแก้ไขข้อมูล entitlement

**Request**:
```bash
curl -X PATCH "http://localhost:3001/api/entitlements/{entitlementId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "pricingMode": "CENTRAL",
    "effectiveTo": "2025-06-30T23:59:59.999Z"
  }'
```

**Expected Result**:
- Status: `200 OK`
- Response: Updated entitlement with relationships
- Only specified fields changed

---

### SE_CRUD_05: Get Store Entitlements
**Purpose**: ทดสอบการดึง entitlements ของ store เฉพาะ

**Request**:
```bash
curl -X GET "http://localhost:3001/api/entitlements/store/{storeId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of entitlements for the store with brand info
- Ordered by `effectiveFrom DESC`

---

### SE_CRUD_06: Get Brand Entitlements (Admin Only)
**Purpose**: ทดสอบการดึง entitlements ของ brand เฉพาะ (Admin เท่านั้น)

**Request**:
```bash
curl -X GET "http://localhost:3001/api/entitlements/brand/{brandId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of entitlements for the brand with store info
- Admin-only access
- Ordered by `effectiveFrom DESC`

---

### SE_LOGIC_01: Check Entitlement Access
**Purpose**: ทดสอบการตรวจสอบว่า store มีสิทธิ์เข้าถึง brand หรือไม่

**Request**:
```bash
curl -X GET "http://localhost:3001/api/entitlements/check/{storeId}/{brandId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: `{"hasAccess": true/false}`
- Checks current time against effective dates
- Returns boolean access status

---

### SE_LOGIC_02: Get Entitlement Statistics
**Purpose**: ทดสอบการดึงสถิติของ entitlements (Admin เท่านั้น)

**Request**:
```bash
curl -X GET "http://localhost:3001/api/entitlements/stats" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response includes:
  - `total` - จำนวน entitlements ทั้งหมด
  - `active` - จำนวน entitlements ที่ active
  - `expired` - จำนวน entitlements ที่หมดอายุ
  - `pending` - จำนวน entitlements ที่รอเริ่มใช้งาน

---

## 🎯 Advanced Query Tests

### Get Active Entitlements Only:
```bash
curl -X GET "http://localhost:3001/api/entitlements/active" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Get Active Entitlements by Store:
```bash
curl -X GET "http://localhost:3001/api/entitlements/store/{storeId}/active" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Get Active Entitlements by Brand:
```bash
curl -X GET "http://localhost:3001/api/entitlements/brand/{brandId}/active" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Revoke Entitlement (Set expiry to now):
```bash
curl -X PATCH "http://localhost:3001/api/entitlements/{entitlementId}/revoke" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Filter Statistics by Store:
```bash
curl -X GET "http://localhost:3001/api/entitlements/stats?storeId={storeId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Filter Statistics by Brand:
```bash
curl -X GET "http://localhost:3001/api/entitlements/stats?brandId={brandId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

---

## 🕐 Time-based Testing

### Current Time Logic Tests:
- Create future entitlement (should not be active yet)
- Create past entitlement (should be expired)
- Test entitlement that expires today
- Test permanent entitlement (effectiveTo: null)

### Date Format Tests:
- Valid ISO date strings
- Invalid date formats (should return 400)
- effectiveFrom after effectiveTo (should return 400)

---

## ❌ Error Testing

### Invalid Data Tests:
- Missing storeId (should return 400)
- Missing brandId (should return 400)
- Invalid UUID format (should return 400)
- Invalid pricingMode enum (should return 400)
- Invalid date format (should return 400)

### Business Logic Tests:
- Duplicate store-brand combination (should handle gracefully)
- Non-existent store ID (should return 400/404)
- Non-existent brand ID (should return 400/404)

### Authorization Tests:
- Store user accessing admin endpoints (should return 403)
- Store user accessing other stores' entitlements (should return 403)

---

## 📊 Expected Results Summary

| Test Case | Status | Auth Required | Expected Response |
|-----------|--------|---------------|-------------------|
| SE_AUTH_01 | 201 | Admin | Entitlement created |
| SE_AUTH_02 | 403 | Store | Forbidden |
| SE_AUTH_03 | 200 | Admin | Entitlement revoked |
| SE_AUTH_04 | 403 | Store | Forbidden |
| SE_CRUD_01 | 201 | Admin | Entitlement object |
| SE_CRUD_02 | 200 | Admin | Entitlements array |
| SE_CRUD_03 | 200 | Any | Entitlement details |
| SE_CRUD_04 | 200 | Admin | Updated entitlement |
| SE_CRUD_05 | 200 | Any | Store entitlements |
| SE_CRUD_06 | 200 | Admin | Brand entitlements |
| SE_LOGIC_01 | 200 | Any | Access check result |
| SE_LOGIC_02 | 200 | Admin | Entitlement statistics |

---

*Last Updated: 2025-09-07*  
*Status: 🔗 Store-Brand Entitlements API Tests Ready*