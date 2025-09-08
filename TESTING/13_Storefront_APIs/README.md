# 🛒 Storefront APIs Testing Guide

## 🎯 Overview
Public-facing E-commerce APIs สำหรับลูกค้าใช้งานหน้าร้าน (ไม่ต้อง Authentication)

## 🛠️ Features to Test

### 1. Public Store Information
- [x] Store Profile Display
- [x] Store Business Hours
- [x] Store Contact Information
- [x] Store Social Media Links

### 2. Product Catalog APIs
- [x] Product Listing with Pagination
- [x] Product Search & Filtering
- [x] Product Detail Display
- [x] Product Availability Checking
- [x] Product Variants Display

### 3. Advanced Search Features
- [x] Text Search (name, description, SKU)
- [x] Brand Filtering
- [x] Category Filtering
- [x] Price Range Filtering
- [x] Status Filtering

## 🧪 Test Cases

### Test Case 1: Get Store Information
```http
GET /api/storefront/{storeSlug}
```

**Example Request:**
```bash
curl -X GET http://localhost:3001/api/storefront/my-awesome-store
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "uuid",
      "name": "My Awesome Store",
      "slug": "my-awesome-store",
      "description": "The best store in town",
      "email": "store@example.com",
      "phone": "+66-12-345-6789",
      "address": {
        "street": "123 Main St",
        "city": "Bangkok",
        "province": "Bangkok",
        "postal_code": "10110",
        "country": "Thailand"
      },
      "website": "https://myawesomestore.com",
      "socialMedia": {
        "facebook": "https://facebook.com/myawesomestore",
        "instagram": "https://instagram.com/myawesomestore",
        "line": "@myawesomestore"
      },
      "businessHours": {
        "monday": "09:00-18:00",
        "tuesday": "09:00-18:00",
        "wednesday": "09:00-18:00",
        "thursday": "09:00-18:00",
        "friday": "09:00-18:00",
        "saturday": "10:00-16:00",
        "sunday": "closed"
      },
      "logo": "https://example.com/logo.jpg",
      "status": "ACTIVE"
    }
  }
}
```

### Test Case 2: Get Store Products (Basic Listing)
```http
GET /api/storefront/{storeSlug}/products
```

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/storefront/my-awesome-store/products"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Amazing Product",
        "slug": "amazing-product",
        "sku": "PROD-001",
        "description": "This is an amazing product",
        "price": "299.99",
        "images": ["https://example.com/product1.jpg"],
        "category": "Electronics",
        "status": "ACTIVE",
        "isActive": true,
        "brand": {
          "id": "uuid",
          "name": "Brand Name",
          "slug": "brand-name",
          "logo": "https://example.com/brand-logo.jpg"
        },
        "availability": {
          "inStock": true,
          "availableQty": 50,
          "reservedQty": 5
        },
        "variants": [
          {
            "id": "uuid",
            "name": "Red - Large",
            "sku": "PROD-001-RED-L",
            "attributes": {
              "color": "red",
              "size": "large"
            },
            "price": "319.99",
            "status": "ACTIVE"
          }
        ]
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 20,
      "offset": 0,
      "pages": 8
    }
  }
}
```

### Test Case 3: Product Search with Filters
```http
GET /api/storefront/{storeSlug}/products?search=phone&brand_id=uuid&category=Electronics&min_price=100&max_price=1000&limit=10&offset=0
```

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/storefront/my-awesome-store/products?search=phone&category=Electronics&min_price=100&max_price=1000&limit=10"
```

### Test Case 4: Product Detail
```http
GET /api/storefront/{storeSlug}/products/{productSlug}
```

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/storefront/my-awesome-store/products/amazing-product"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Amazing Product",
      "slug": "amazing-product",
      "sku": "PROD-001",
      "description": "Detailed product description...",
      "price": "299.99",
      "images": [
        "https://example.com/product1.jpg",
        "https://example.com/product2.jpg"
      ],
      "specifications": {
        "weight": "1.2kg",
        "dimensions": "30x20x5cm",
        "material": "Plastic"
      },
      "attributes": {
        "warranty": "1 year",
        "origin": "Thailand"
      },
      "category": "Electronics",
      "tags": ["electronics", "gadgets", "popular"],
      "status": "ACTIVE",
      "brand": {
        "id": "uuid",
        "name": "Brand Name",
        "slug": "brand-name",
        "description": "Brand description",
        "logo": "https://example.com/brand-logo.jpg"
      },
      "availability": {
        "inStock": true,
        "availableQty": 50,
        "reservedQty": 5,
        "soldQty": 100
      },
      "variants": [
        {
          "id": "uuid",
          "name": "Red - Large",
          "sku": "PROD-001-RED-L",
          "attributes": {
            "color": "red",
            "size": "large"
          },
          "price": "319.99",
          "status": "ACTIVE",
          "availability": {
            "inStock": true,
            "availableQty": 10,
            "reservedQty": 2
          }
        }
      ]
    }
  }
}
```

### Test Case 5: Check Product Availability
```http
GET /api/storefront/{storeSlug}/products/{productId}/availability
```

**Example Request:**
```bash
curl -X GET "http://localhost:3001/api/storefront/my-awesome-store/products/uuid/availability"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "availability": {
      "inStock": true,
      "availableQty": 50,
      "reservedQty": 5,
      "soldQty": 100,
      "lastUpdated": "2025-09-07T10:30:00Z"
    },
    "variants": [
      {
        "variantId": "uuid",
        "name": "Red - Large",
        "inStock": true,
        "availableQty": 10,
        "reservedQty": 2
      }
    ]
  }
}
```

## 🔧 Test Scenarios

### Scenario 1: Customer Browse Store
1. Get store information
2. List products with pagination
3. Filter products by category
4. Search products by keyword
5. View product details
6. Check product availability

### Scenario 2: Product Search & Filter
1. Search products by text
2. Filter by brand
3. Filter by category
4. Filter by price range
5. Combine multiple filters
6. Test pagination with filters

### Scenario 3: Product Availability
1. Check in-stock products
2. Check out-of-stock products
3. Check products with variants
4. Verify stock quantities
5. Test reserved quantity display

## ✅ Validation Checklist

### API Response Validation
- [ ] Correct HTTP status codes
- [ ] Consistent response format
- [ ] Proper error handling
- [ ] Data completeness
- [ ] Field data types

### Store Information Tests
- [ ] Store profile displays correctly
- [ ] Business hours format correct
- [ ] Contact information complete
- [ ] Social media links valid
- [ ] Logo/images load properly

### Product Catalog Tests
- [ ] Product list pagination works
- [ ] Search functionality accurate
- [ ] Filtering works correctly
- [ ] Product details complete
- [ ] Image URLs accessible

### Search & Filter Tests
- [ ] Text search covers all fields
- [ ] Brand filtering accurate
- [ ] Category filtering works
- [ ] Price range filtering correct
- [ ] Multiple filters combine properly

### Availability Tests
- [ ] Stock quantities accurate
- [ ] In-stock/out-of-stock status correct
- [ ] Variant availability separate
- [ ] Reserved quantities shown
- [ ] Real-time updates reflected

### Performance Tests
- [ ] Response times under 500ms
- [ ] Large product catalogs handle well
- [ ] Search performance acceptable
- [ ] Image loading optimized
- [ ] Pagination efficient

## 🚨 Edge Cases to Test

### Invalid Store Slug
```bash
curl -X GET http://localhost:3001/api/storefront/non-existent-store
```
**Expected:** 404 Not Found

### Invalid Product Slug
```bash
curl -X GET http://localhost:3001/api/storefront/my-store/products/non-existent-product
```
**Expected:** 404 Not Found

### Large Pagination Request
```bash
curl -X GET "http://localhost:3001/api/storefront/my-store/products?limit=1000&offset=10000"
```
**Expected:** Proper limit enforcement

### Special Characters in Search
```bash
curl -X GET "http://localhost:3001/api/storefront/my-store/products?search=<script>alert('xss')</script>"
```
**Expected:** Proper sanitization

### Invalid Price Ranges
```bash
curl -X GET "http://localhost:3001/api/storefront/my-store/products?min_price=abc&max_price=xyz"
```
**Expected:** Validation error or ignored

## 📊 Performance Benchmarks

### Response Time Targets
- Store information: < 200ms
- Product listing: < 500ms
- Product search: < 800ms
- Product detail: < 300ms
- Availability check: < 200ms

### Load Testing
```bash
# Test concurrent requests
for i in {1..50}; do
  curl -X GET "http://localhost:3001/api/storefront/my-store/products" &
done
```

---

## 🔄 Integration with Order System

### Test Order Flow
1. Browse products via storefront
2. Check product availability
3. Create order (using Order APIs)
4. Verify stock reservation
5. Confirm order
6. Check updated availability

---

*Last Updated: 2025-09-07*
*Status: Phase 5 - Storefront APIs Testing Ready*