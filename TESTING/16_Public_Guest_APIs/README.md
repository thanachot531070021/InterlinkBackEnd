# 🌍 Public Guest APIs Testing Suite

**Testing 8 Public API endpoints that require no authentication for optimal user experience**

## 📋 Overview

The Public Guest APIs allow visitors to browse products, brands, stores, and categories without requiring authentication. This improves UX by letting users explore before deciding to register/login.

### 🎯 Testing Scope
- **8 Public API endpoints** under `/api/public/`
- **Rate limiting** protection via ThrottlerGuard
- **Guest browsing** functionality
- **Search and filtering** capabilities
- **Response validation** for all endpoints

### 🔧 Prerequisites
- Backend server running at `http://localhost:3001`
- Database seeded with demo data (`npm run prisma:seed`)
- ThrottlerGuard enabled (100 requests per 60 seconds)

## 🌐 Public Endpoints to Test

### 1. Product Browsing APIs

#### 1.1 Browse Active Products
**Endpoint**: `GET /api/public/products`

**Test Cases**:
```bash
# Basic product listing
curl -X GET "http://localhost:3001/api/public/products"

# With pagination
curl -X GET "http://localhost:3001/api/public/products?limit=5&offset=0"

# Search by name
curl -X GET "http://localhost:3001/api/public/products?search=iPhone"

# Filter by category
curl -X GET "http://localhost:3001/api/public/products?category=Electronics"

# Filter by brand
curl -X GET "http://localhost:3001/api/public/products?brandId={brand-uuid}"

# Price range filtering
curl -X GET "http://localhost:3001/api/public/products?minPrice=1000&maxPrice=50000"

# Combined filters
curl -X GET "http://localhost:3001/api/public/products?search=Pro&category=Electronics&limit=10"
```

**Expected Response**:
```json
{
  "products": [
    {
      "id": "product-uuid",
      "name": "Product Name",
      "slug": "product-slug",
      "sku": "PROD-SKU-123",
      "description": "Product description",
      "category": "Electronics",
      "price": 39900.00,
      "images": ["image1.jpg"],
      "brand": {
        "id": "brand-uuid",
        "name": "Brand Name",
        "slug": "brand-slug",
        "logo": "brand-logo.png"
      },
      "hasStock": true,
      "storesAvailable": 3
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 24,
    "offset": 0,
    "hasMore": true
  }
}
```

#### 1.2 Product Details
**Endpoint**: `GET /api/public/products/:id`

**Test Cases**:
```bash
# Get product details with store availability
curl -X GET "http://localhost:3001/api/public/products/{product-uuid}"

# Test with non-existent product
curl -X GET "http://localhost:3001/api/public/products/non-existent-uuid"
```

**Expected Response**:
```json
{
  "id": "product-uuid",
  "name": "Product Name",
  "slug": "product-slug",
  "sku": "PROD-SKU-123",
  "description": "Detailed product description",
  "category": "Electronics",
  "price": 39900.00,
  "images": ["image1.jpg", "image2.jpg"],
  "attributes": {
    "color": "Black",
    "storage": "256GB"
  },
  "brand": {
    "id": "brand-uuid",
    "name": "Brand Name",
    "slug": "brand-slug",
    "description": "Brand description",
    "logo": "brand-logo.png"
  },
  "storesCarrying": [
    {
      "storeId": "store-uuid",
      "storeName": "Store Name",
      "storeSlug": "store-slug",
      "storeLogo": "store-logo.png",
      "price": 39900.00,
      "availableQty": 5,
      "hasStock": true
    }
  ],
  "totalStores": 2,
  "hasStock": true
}
```

### 2. Brand Information APIs

#### 2.1 List Active Brands
**Endpoint**: `GET /api/public/brands`

**Test Cases**:
```bash
# Get all active brands
curl -X GET "http://localhost:3001/api/public/brands"
```

**Expected Response**:
```json
{
  "brands": [
    {
      "id": "brand-uuid",
      "name": "Apple",
      "slug": "apple",
      "description": "Technology company",
      "logo": "apple-logo.png",
      "productCount": 25,
      "isActive": true
    }
  ],
  "total": 6
}
```

#### 2.2 Brand Details
**Endpoint**: `GET /api/public/brands/:id`

**Test Cases**:
```bash
# Get brand details with products
curl -X GET "http://localhost:3001/api/public/brands/{brand-uuid}"

# Test with non-existent brand
curl -X GET "http://localhost:3001/api/public/brands/non-existent-uuid"
```

**Expected Response**:
```json
{
  "id": "brand-uuid",
  "name": "Apple",
  "slug": "apple",
  "description": "Leading technology company",
  "logo": "apple-logo.png",
  "products": [
    {
      "id": "product-uuid",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256",
      "description": "Latest iPhone",
      "category": "Electronics",
      "price": 39900.00,
      "images": ["iphone-image.jpg"],
      "hasStock": true,
      "storesAvailable": 3
    }
  ],
  "productCount": 20,
  "isActive": true
}
```

### 3. Store Discovery APIs

#### 3.1 List Active Stores
**Endpoint**: `GET /api/public/stores`

**Test Cases**:
```bash
# Get all active stores
curl -X GET "http://localhost:3001/api/public/stores"
```

**Expected Response**:
```json
{
  "stores": [
    {
      "id": "store-uuid",
      "name": "Tech Store Bangkok",
      "slug": "tech-store-bangkok",
      "description": "Premium electronics store",
      "logo": "store-logo.png",
      "email": "info@techstore.com",
      "phone": "+66812345678",
      "address": {
        "street": "123 Sukhumvit Road",
        "city": "Bangkok",
        "province": "Bangkok",
        "postalCode": "10110"
      },
      "productCount": 45,
      "status": "ACTIVE",
      "subscriptionStatus": "ACTIVE"
    }
  ],
  "total": 5
}
```

### 4. Category Exploration APIs

#### 4.1 Product Categories
**Endpoint**: `GET /api/public/categories`

**Test Cases**:
```bash
# Get all product categories with counts
curl -X GET "http://localhost:3001/api/public/categories"
```

**Expected Response**:
```json
{
  "categories": [
    {
      "name": "Electronics",
      "productCount": 125,
      "brands": ["Apple", "Samsung", "Sony"]
    },
    {
      "name": "Fashion",
      "productCount": 89,
      "brands": ["Nike", "Adidas"]
    }
  ],
  "total": 8
}
```

### 5. Search Functionality APIs

#### 5.1 Search Suggestions
**Endpoint**: `GET /api/public/search/suggestions`

**Test Cases**:
```bash
# Get search suggestions for products and brands
curl -X GET "http://localhost:3001/api/public/search/suggestions?q=iPhone"

# With custom limit
curl -X GET "http://localhost:3001/api/public/search/suggestions?q=Pro&limit=5"

# Short query (should return empty)
curl -X GET "http://localhost:3001/api/public/search/suggestions?q=i"

# Empty query
curl -X GET "http://localhost:3001/api/public/search/suggestions?q="
```

**Expected Response**:
```json
{
  "query": "iPhone",
  "suggestions": [
    {
      "id": "product-uuid",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256",
      "category": "Electronics",
      "brand": "Apple",
      "type": "product"
    },
    {
      "id": "brand-uuid",
      "name": "Apple",
      "slug": "apple",
      "type": "brand"
    }
  ],
  "total": 2
}
```

## 🛡️ Rate Limiting Tests

### Test Rate Limiting Protection
**ThrottlerGuard Configuration**: 100 requests per 60 seconds

```bash
# Create a script to test rate limiting
for i in {1..105}; do
  echo "Request $i"
  curl -X GET "http://localhost:3001/api/public/products" -w " Status: %{http_code}\n"
  if [ $i -gt 100 ]; then
    echo "Should be rate limited now..."
    sleep 1
  fi
done
```

**Expected Behavior**:
- Requests 1-100: Status 200 (OK)
- Requests 101+: Status 429 (Too Many Requests)

**Rate Limit Error Response**:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## ❌ Error Testing

### Test Invalid Requests

```bash
# Invalid UUID format
curl -X GET "http://localhost:3001/api/public/products/invalid-uuid"
# Expected: 400 Bad Request

# Non-existent product
curl -X GET "http://localhost:3001/api/public/products/123e4567-e89b-12d3-a456-426614174000"
# Expected: 404 Not Found

# Invalid query parameters
curl -X GET "http://localhost:3001/api/public/products?limit=abc"
# Expected: 400 Bad Request

# Negative pagination values
curl -X GET "http://localhost:3001/api/public/products?limit=-5&offset=-10"
# Expected: 400 Bad Request (should handle gracefully)
```

## ✅ Validation Checklist

### Data Quality Checks
- [ ] Only active products are returned (`isActive: true`, `status: 'ACTIVE'`)
- [ ] Only active brands are returned (`isActive: true`)
- [ ] Only active stores are returned (`status: 'ACTIVE'`)
- [ ] Stock information is accurate (`hasStock`, `storesAvailable`)
- [ ] Price information is consistent across endpoints

### Response Structure Validation
- [ ] All responses follow consistent JSON structure
- [ ] Required fields are always present
- [ ] Optional fields handle null/undefined correctly
- [ ] Pagination metadata is accurate
- [ ] Filter results match applied criteria

### Performance Testing
- [ ] Response time < 500ms for simple queries
- [ ] Response time < 1s for complex queries with joins
- [ ] Pagination works efficiently with large datasets
- [ ] Search functionality performs adequately

### Security Testing
- [ ] No sensitive data exposed (internal IDs, admin info)
- [ ] Rate limiting protects against abuse
- [ ] Input validation prevents injection attacks
- [ ] Error messages don't reveal system internals

## 🔍 Database Verification

After running tests, verify data consistency in Prisma Studio:

1. **Check Products**: Only `isActive: true` and `status: 'ACTIVE'` products appear
2. **Check Brands**: Only `isActive: true` brands are listed
3. **Check Stores**: Only `status: 'ACTIVE'` stores are shown
4. **Check Stock**: `storesAvailable` count matches actual stock records
5. **Check Categories**: Categories are dynamically generated from active products

## 📊 Test Results Documentation

### Success Metrics
- [ ] All 8 endpoints return 200 OK for valid requests
- [ ] Error handling returns appropriate HTTP status codes
- [ ] Rate limiting activates at 100+ requests per minute
- [ ] All data filtering works correctly
- [ ] Response times meet performance criteria

### Common Issues to Watch For
- **Performance**: Slow queries due to missing indexes
- **Data Consistency**: Mismatch between stock counts and actual inventory
- **Rate Limiting**: False positives or ineffective protection
- **Validation**: Insufficient input sanitization
- **Error Handling**: Unclear error messages

## 🚀 Testing Script Example

```bash
#!/bin/bash
# Public APIs Testing Script

BASE_URL="http://localhost:3001/api/public"

echo "🌍 Testing Public Guest APIs..."

# Test 1: List products
echo "1. Testing product listing..."
curl -s "$BASE_URL/products?limit=5" | jq '.products | length'

# Test 2: Search products
echo "2. Testing product search..."
curl -s "$BASE_URL/products?search=Pro" | jq '.products[0].name'

# Test 3: List brands
echo "3. Testing brand listing..."
curl -s "$BASE_URL/brands" | jq '.total'

# Test 4: List stores  
echo "4. Testing store listing..."
curl -s "$BASE_URL/stores" | jq '.total'

# Test 5: Get categories
echo "5. Testing categories..."
curl -s "$BASE_URL/categories" | jq '.categories | length'

# Test 6: Search suggestions
echo "6. Testing search suggestions..."
curl -s "$BASE_URL/search/suggestions?q=iPhone" | jq '.suggestions | length'

echo "✅ Public APIs testing completed!"
```

---

**Goal**: Ensure all public APIs provide excellent user experience for guest visitors while maintaining security and performance standards.