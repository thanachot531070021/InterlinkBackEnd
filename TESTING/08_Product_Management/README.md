# 📦 Product Management API Testing

การทดสอบ Product Management APIs สำหรับระบบจัดการสินค้า

## 📋 Test Cases Overview

รวม **15 test cases** สำหรับ Product Management:

### 🔐 Authentication & Authorization Tests
1. **PM_AUTH_01** - Admin create product (should succeed)
2. **PM_AUTH_02** - Store admin create product (should succeed)
3. **PM_AUTH_03** - Store staff create product (should fail)
4. **PM_AUTH_04** - Admin delete product (should succeed)
5. **PM_AUTH_05** - Store user delete product (should fail)

### 📊 CRUD Operations Tests
6. **PM_CRUD_01** - Create product with valid data
7. **PM_CRUD_02** - Get all products list
8. **PM_CRUD_03** - Get product by ID with details
9. **PM_CRUD_04** - Update product information
10. **PM_CRUD_05** - Get product by slug
11. **PM_CRUD_06** - Get product by SKU

### 🔍 Advanced Search & Filter Tests
12. **PM_SEARCH_01** - Search products with text query
13. **PM_SEARCH_02** - Filter products by brand
14. **PM_SEARCH_03** - Filter products by price range
15. **PM_STATS_01** - Get product statistics (Admin only)

---

## 🧪 Detailed Test Cases

### PM_AUTH_01: Admin Create Product
**Purpose**: ทดสอบว่า Admin สามารถสร้าง product ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/products" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "sku": "APL-IPH15P-256-BLK",
    "description": "Latest iPhone with A17 Pro chip",
    "brandId": "uuid-of-apple-brand",
    "category": "Smartphones",
    "price": 39900.00,
    "images": [
      "https://example.com/iphone15pro-1.jpg",
      "https://example.com/iphone15pro-2.jpg"
    ],
    "attributes": {
      "color": "Black",
      "storage": "256GB",
      "connectivity": "5G"
    }
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response: Product object with brand relationship
- Default status: `ACTIVE`

---

### PM_AUTH_02: Store Admin Create Product
**Purpose**: ทดสอบว่า Store Admin สามารถสร้าง product ได้

**Request**:
```bash
curl -X POST "http://localhost:3001/api/products" \
  -H "Authorization: Bearer ${STORE_ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Store Custom Product",
    "slug": "store-custom-product",
    "sku": "STORE-CUSTOM-001",
    "brandId": "uuid-of-brand",
    "createdByStoreId": "uuid-of-store",
    "category": "Electronics",
    "price": 1500.00
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response: Product with `createdByStoreId` set
- Store-created product marked properly

---

### PM_CRUD_01: Create Product with Full Data
**Purpose**: ทดสอบการสร้าง product ด้วยข้อมูลครบถ้วน

**Request**:
```bash
curl -X POST "http://localhost:3001/api/products" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Galaxy S24 Ultra",
    "slug": "samsung-galaxy-s24-ultra",
    "sku": "SAM-GS24U-512-TIT",
    "description": "Premium Android flagship with S Pen",
    "brandId": "uuid-of-samsung-brand",
    "category": "Smartphones",
    "price": 45900.00,
    "images": [
      "https://example.com/galaxy-s24-ultra.jpg"
    ],
    "attributes": {
      "color": "Titanium Gray",
      "storage": "512GB",
      "ram": "12GB",
      "display": "6.8 inch Dynamic AMOLED"
    },
    "status": "ACTIVE"
  }'
```

**Expected Result**:
- Status: `201 Created`
- Response contains all provided fields
- Brand relationship loaded
- UUID generated for ID

---

### PM_CRUD_02: Get All Products
**Purpose**: ทดสอบการดึงรายการ products ทั้งหมด

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Array of products with brand info
- Ordered by `createdAt DESC`

---

### PM_CRUD_03: Get Product by ID with Details
**Purpose**: ทดสอบการดึงข้อมูล product พร้อม relationships

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products/{productId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response includes:
  - Product basic info with brand
  - `variants` array (up to 10 variants)
  - `stocks` array (up to 10 store stocks with store info)

---

### PM_CRUD_04: Update Product Information
**Purpose**: ทดสอบการแก้ไขข้อมูล product

**Request**:
```bash
curl -X PATCH "http://localhost:3001/api/products/{productId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated premium smartphone description",
    "price": 42900.00,
    "attributes": {
      "color": "Titanium Gray",
      "storage": "512GB",
      "promotion": "Limited Time Offer"
    }
  }'
```

**Expected Result**:
- Status: `200 OK`
- Response: Updated product with brand info
- Only specified fields changed

---

### PM_CRUD_05: Get Product by Slug
**Purpose**: ทดสอบการค้นหา product ด้วย slug

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products/slug/iphone-15-pro" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Product with active variants only
- Brand relationship included

---

### PM_CRUD_06: Get Product by SKU
**Purpose**: ทดสอบการค้นหา product ด้วย SKU

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products/sku/APL-IPH15P-256-BLK" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Product with brand and variants
- Exact SKU match

---

### PM_SEARCH_01: Search Products with Text
**Purpose**: ทดสอบการค้นหา products ด้วยคำค้น

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products/search?search=iPhone&limit=10" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Paginated search results
- Search in name, description, and SKU
- Includes pagination metadata

---

### PM_SEARCH_02: Filter Products by Brand
**Purpose**: ทดสอบการกรอง products ตาม brand

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products/search?brandId={brandId}&limit=20" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Products from specified brand only
- Includes brand relationship

---

### PM_SEARCH_03: Filter Products by Price Range
**Purpose**: ทดสอบการกรอง products ตามช่วงราคา

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products/search?minPrice=10000&maxPrice=50000&limit=15" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response: Products within specified price range
- Proper price filtering applied

---

### PM_STATS_01: Get Product Statistics
**Purpose**: ทดสอบการดึงสถิติของ product (Admin/Store Admin only)

**Request**:
```bash
curl -X GET "http://localhost:3001/api/products/{productId}/stats" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Result**:
- Status: `200 OK`
- Response includes:
  - Product basic info with brand
  - `stats.totalVariants` - จำนวน variants ทั้งหมด
  - `stats.activeVariants` - จำนวน variants ที่ active
  - `stats.totalStores` - จำนวนร้านค้าที่มีสต๊อก
  - `stats.totalOrders` - จำนวน order items
  - `stats.stockSummary` - สรุปสต๊อกรวม (available, reserved, sold)

---

## 🔍 Advanced Search Features

### Multi-parameter Search:
```bash
curl -X GET "http://localhost:3001/api/products/search?search=smartphone&category=Electronics&minPrice=20000&maxPrice=60000&status=ACTIVE&limit=25&offset=0" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Get Products by Store:
```bash
curl -X GET "http://localhost:3001/api/products/store/{storeId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Get Products by Brand:
```bash
curl -X GET "http://localhost:3001/api/products/brand/{brandId}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

---

## ❌ Error Testing

### Invalid Data Tests:
- Empty name (should return 400)
- Invalid price (negative/non-numeric) (should return 400)
- Invalid brandId (should return 400)
- Duplicate SKU (should return 400/409)
- Invalid slug format (should return 400)

### Not Found Tests:
- Get non-existent product ID (should return 404)
- Get non-existent slug (should return 404)
- Get non-existent SKU (should return 404)

### Authorization Tests:
- Store staff creating products (should return 403)
- Non-admin accessing product stats (should return 403)
- Store user deleting products (should return 403)

---

## 📊 Expected Results Summary

| Test Case | Status | Auth Required | Expected Response |
|-----------|--------|---------------|-------------------|
| PM_AUTH_01 | 201 | Admin | Product created |
| PM_AUTH_02 | 201 | Store Admin | Store product created |
| PM_AUTH_03 | 403 | Store Staff | Forbidden |
| PM_AUTH_04 | 200 | Admin | Product deleted |
| PM_AUTH_05 | 403 | Store | Forbidden |
| PM_CRUD_01 | 201 | Admin | Product object |
| PM_CRUD_02 | 200 | Any | Products array |
| PM_CRUD_03 | 200 | Any | Product + details |
| PM_CRUD_04 | 200 | Admin/Store Admin | Updated product |
| PM_CRUD_05 | 200 | Any | Product by slug |
| PM_CRUD_06 | 200 | Any | Product by SKU |
| PM_SEARCH_01 | 200 | Any | Search results |
| PM_SEARCH_02 | 200 | Any | Brand products |
| PM_SEARCH_03 | 200 | Any | Price filtered |
| PM_STATS_01 | 200 | Admin/Store Admin | Product statistics |

---

*Last Updated: 2025-09-07*  
*Status: 📦 Product Management API Tests Ready*