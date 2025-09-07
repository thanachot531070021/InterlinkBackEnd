# 🏷️ Brand Management API Testing

การทดสอบ Brand Management APIs สำหรับระบบจัดการแบรนด์

## 📋 Test Cases Overview

รวม **10 test cases** สำหรับ Brand Management:

### 🔐 Authentication & Authorization Tests
1. **BM_AUTH_01** - Admin create brand (should succeed)
2. **BM_AUTH_02** - Store user create brand (should fail)
3. **BM_AUTH_03** - Admin delete brand (should succeed)
4. **BM_AUTH_04** - Store user access brand stats (should fail)

### 📊 CRUD Operations Tests
5. **BM_CRUD_01** - Create brand with valid data
6. **BM_CRUD_02** - Get all brands list
7. **BM_CRUD_03** - Get brand by ID with details
8. **BM_CRUD_04** - Update brand information
9. **BM_CRUD_05** - Get brand by slug
10. **BM_CRUD_06** - Get brand statistics (Admin only)

---

## 🧪 Detailed Test Cases

### BM_AUTH_01: Admin Create Brand
**Purpose**: ทดสอบว่า Admin สามารถสร้าง brand ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/brands" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Brand",
    "slug": "test-brand",
    "description": "A test brand for API testing",
    "logo": "https://example.com/logo.png",
    "isActive": true
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response: Brand object with generated ID
- Headers: `Content-Type: application/json`

---

### BM_AUTH_02: Store User Create Brand (Should Fail)
**Purpose**: ทดสอบว่า Store user ไม่สามารถสร้าง brand ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/brands" \
  -H "Authorization: Bearer ${STORE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unauthorized Brand",
    "slug": "unauthorized-brand"
  }'
```

**Expected Result**:
- Status: `403 Forbidden`
- Response: Error message about insufficient permissions

---

### BM_CRUD_01: Create Brand with Valid Data
**Purpose**: ทดสอบการสร้าง brand ด้วยข้อมูลที่ถูกต้อง

**Request**:
```bash
curl -X POST "http://localhost:3001/api/brands" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple",
    "slug": "apple",
    "description": "Technology brand",
    "logo": "https://example.com/apple-logo.png"
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response contains: id, name, slug, description, logo, isActive, createdAt, updatedAt
- `isActive` defaults to `true`

---

### BM_CRUD_02: Get All Brands List
**Purpose**: ทดสอบการดึงรายการ brands ทั้งหมด

**Request**:
```bash
curl -X GET "http://localhost:3001/api/brands" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of brand objects
- Ordered by `createdAt DESC`

---

### BM_CRUD_03: Get Brand by ID
**Purpose**: ทดสอบการดึงข้อมูล brand ตาม ID พร้อม relationships

**Request**:
```bash
curl -X GET "http://localhost:3001/api/brands/{brandId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Brand object with products array (up to 10 items)
- Products ordered by `createdAt DESC`

---

### BM_CRUD_04: Update Brand Information
**Purpose**: ทดสอบการแก้ไขข้อมูล brand

**Request**:
```bash
curl -X PATCH "http://localhost:3001/api/brands/{brandId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated technology brand description",
    "isActive": true
  }'
```

**Expected Result**:
- Status: `200 OK`
- Response: Updated brand object
- Only specified fields updated

---

### BM_CRUD_05: Get Brand by Slug
**Purpose**: ทดสอบการค้นหา brand ด้วย slug

**Request**:
```bash
curl -X GET "http://localhost:3001/api/brands/slug/apple" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Brand object with active products only
- Products filtered by `status: 'ACTIVE'`

---

### BM_CRUD_06: Get Brand Statistics (Admin Only)
**Purpose**: ทดสอบการดึงสถิติของ brand (Admin เท่านั้น)

**Request**:
```bash
curl -X GET "http://localhost:3001/api/brands/{brandId}/stats" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response includes:
  - Brand basic info
  - `stats.totalProducts` - จำนวนสินค้าทั้งหมด
  - `stats.activeProducts` - จำนวนสินค้าที่ active
  - `stats.totalStores` - จำนวนร้านค้าที่มีสิทธิ์
  - `stats.totalPermissions` - จำนวน permissions

---

## ❌ Error Testing

### Invalid Data Tests:
- Empty name (should return 400)
- Invalid slug format (should return 400)
- Duplicate slug (should return 400/409)
- Missing required fields (should return 400)

### Not Found Tests:
- Get non-existent brand ID (should return 404)
- Get non-existent slug (should return 404)
- Update non-existent brand (should return 404)

---

## 📊 Expected Results Summary

| Test Case | Status | Auth Required | Expected Response |
|-----------|--------|---------------|-------------------|
| BM_AUTH_01 | 201 | Admin | Brand created |
| BM_AUTH_02 | 403 | Store | Forbidden |
| BM_CRUD_01 | 201 | Admin | Brand object |
| BM_CRUD_02 | 200 | Any | Brands array |
| BM_CRUD_03 | 200 | Any | Brand + products |
| BM_CRUD_04 | 200 | Admin | Updated brand |
| BM_CRUD_05 | 200 | Any | Brand by slug |
| BM_CRUD_06 | 200 | Admin | Brand statistics |

---

*Last Updated: 2025-09-07*  
*Status: 🏷️ Brand Management API Tests Ready*