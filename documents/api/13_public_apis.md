# 🌍 Public Guest APIs Documentation

**8 Public API endpoints that require no authentication - Perfect for product discovery and improved UX**

## Overview

The Public Guest APIs allow visitors to browse products, brands, stores, and categories without requiring authentication. This improves the user experience by enabling product discovery before registration/login.

### Key Features
- ✅ **No authentication required** - Perfect for guest browsing
- 🛡️ **Rate limiting protection** via ThrottlerGuard (100 req/min)
- 🔍 **Advanced search and filtering** capabilities
- 📊 **Rich product information** with stock availability
- 🏪 **Store discovery** with product counts
- 🏷️ **Brand exploration** with product listings
- 📁 **Dynamic categories** from active products
- 💡 **Smart search suggestions** for products and brands

## Base URL
```
GET /api/public/*
```

## Rate Limiting
- **Limit**: 100 requests per 60 seconds per IP
- **Protection**: ThrottlerGuard enabled on all public endpoints
- **Error Response**: 429 Too Many Requests when exceeded

---

## 📦 Product APIs

### 1. Browse Active Products
**Endpoint**: `GET /api/public/products`

Browse all active products with comprehensive filtering and pagination.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `search` | string | No | Search by product name | `iPhone` |
| `category` | string | No | Filter by category | `Electronics` |
| `brandId` | string | No | Filter by brand UUID | `brand-uuid-123` |
| `minPrice` | number | No | Minimum price filter | `1000` |
| `maxPrice` | number | No | Maximum price filter | `50000` |
| `limit` | number | No | Items per page (default: 24, max: 100) | `10` |
| `offset` | number | No | Pagination offset (default: 0) | `0` |

#### Example Requests
```bash
# Basic product listing
curl -X GET "http://localhost:3001/api/public/products"

# Search for iPhone products
curl -X GET "http://localhost:3001/api/public/products?search=iPhone"

# Filter by category and limit results
curl -X GET "http://localhost:3001/api/public/products?category=Electronics&limit=5"

# Price range filtering
curl -X GET "http://localhost:3001/api/public/products?minPrice=10000&maxPrice=50000"

# Combined filters
curl -X GET "http://localhost:3001/api/public/products?search=Pro&category=Electronics&brandId=brand-uuid&limit=10"
```

#### Response Example
```json
{
  "products": [
    {
      "id": "product-uuid-789",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256-BLK",
      "description": "Latest iPhone with advanced camera system",
      "category": "Electronics",
      "price": 39900.00,
      "images": [
        "https://example.com/iphone15pro-1.jpg",
        "https://example.com/iphone15pro-2.jpg"
      ],
      "brand": {
        "id": "brand-uuid-789",
        "name": "Apple",
        "slug": "apple",
        "logo": "https://example.com/apple-logo.png"
      },
      "hasStock": true,
      "storesAvailable": 3,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-02-20T14:45:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 24,
    "offset": 0,
    "hasMore": true
  },
  "filters": {
    "search": "iPhone",
    "category": "Electronics",
    "brandId": "brand-uuid-789",
    "priceRange": {
      "min": 10000,
      "max": 50000
    }
  }
}
```

### 2. Product Details
**Endpoint**: `GET /api/public/products/{id}`

Get detailed information about a specific product including store availability.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Product UUID |

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/public/products/product-uuid-789"
```

#### Response Example
```json
{
  "id": "product-uuid-789",
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "sku": "APL-IPH15P-256-BLK",
  "description": "Latest iPhone with advanced camera system and A17 Pro chip",
  "category": "Electronics",
  "price": 39900.00,
  "images": [
    "https://example.com/iphone15pro-1.jpg",
    "https://example.com/iphone15pro-2.jpg"
  ],
  "attributes": {
    "color": "Black",
    "storage": "256GB",
    "connectivity": "5G"
  },
  "brand": {
    "id": "brand-uuid-789",
    "name": "Apple",
    "slug": "apple",
    "description": "Leading technology brand",
    "logo": "https://example.com/apple-logo.png"
  },
  "storesCarrying": [
    {
      "storeId": "store-uuid-123",
      "storeName": "Tech Store Bangkok",
      "storeSlug": "tech-store-bangkok",
      "storeLogo": "https://example.com/store-logo.png",
      "price": 39900.00,
      "availableQty": 5,
      "hasStock": true
    }
  ],
  "totalStores": 2,
  "hasStock": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-02-20T14:45:00Z"
}
```

---

## 🏷️ Brand APIs

### 3. List Active Brands
**Endpoint**: `GET /api/public/brands`

Get all active brands with product counts.

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/public/brands"
```

#### Response Example
```json
{
  "brands": [
    {
      "id": "brand-uuid-789",
      "name": "Apple",
      "slug": "apple",
      "description": "Leading technology brand",
      "logo": "https://example.com/apple-logo.png",
      "productCount": 25,
      "isActive": true
    },
    {
      "id": "brand-uuid-456",
      "name": "Samsung",
      "slug": "samsung",
      "description": "Innovation in technology",
      "logo": "https://example.com/samsung-logo.png",
      "productCount": 18,
      "isActive": true
    }
  ],
  "total": 8
}
```

### 4. Brand Details
**Endpoint**: `GET /api/public/brands/{id}`

Get detailed brand information with product listings.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Brand UUID |

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/public/brands/brand-uuid-789"
```

#### Response Example
```json
{
  "id": "brand-uuid-789",
  "name": "Apple",
  "slug": "apple",
  "description": "Leading technology brand with innovative products",
  "logo": "https://example.com/apple-logo.png",
  "products": [
    {
      "id": "product-uuid-789",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256-BLK",
      "description": "Latest iPhone with advanced features",
      "category": "Electronics",
      "price": 39900.00,
      "images": ["https://example.com/iphone15pro-1.jpg"],
      "hasStock": true,
      "storesAvailable": 3
    }
  ],
  "productCount": 20,
  "isActive": true
}
```

---

## 🏪 Store APIs

### 5. List Active Stores
**Endpoint**: `GET /api/public/stores`

Get all active stores with product counts and basic information.

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/public/stores"
```

#### Response Example
```json
{
  "stores": [
    {
      "id": "store-uuid-456",
      "name": "Tech Store Bangkok",
      "slug": "tech-store-bangkok",
      "description": "Premium electronics store",
      "logo": "https://example.com/store-logo.png",
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
  "total": 12
}
```

---

## 📁 Category APIs

### 6. Product Categories
**Endpoint**: `GET /api/public/categories`

Get all product categories with counts and associated brands.

#### Example Request
```bash
curl -X GET "http://localhost:3001/api/public/categories"
```

#### Response Example
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
    },
    {
      "name": "Home & Living",
      "productCount": 67,
      "brands": ["IKEA", "Philips"]
    }
  ],
  "total": 8
}
```

---

## 🔍 Search APIs

### 7. Search Suggestions
**Endpoint**: `GET /api/public/search/suggestions`

Get intelligent search suggestions for products and brands.

#### Query Parameters
| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `q` | string | Yes | Search query (min 2 characters) | - |
| `limit` | number | No | Number of suggestions | 10 |

#### Example Requests
```bash
# Basic search suggestions
curl -X GET "http://localhost:3001/api/public/search/suggestions?q=iPhone"

# With custom limit
curl -X GET "http://localhost:3001/api/public/search/suggestions?q=Pro&limit=5"
```

#### Response Example
```json
{
  "query": "iPhone",
  "suggestions": [
    {
      "id": "product-uuid-789",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256-BLK",
      "category": "Electronics",
      "brand": "Apple",
      "type": "product"
    },
    {
      "id": "product-uuid-456",
      "name": "iPhone 15",
      "slug": "iphone-15",
      "sku": "APL-IPH15-128-BLU",
      "category": "Electronics",
      "brand": "Apple",
      "type": "product"
    },
    {
      "id": "brand-uuid-789",
      "name": "Apple",
      "slug": "apple",
      "type": "brand"
    }
  ],
  "total": 3
}
```

---

## ❌ Error Responses

### Common Error Scenarios

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": ["Parameter 'id' must be a valid UUID"]
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Product not found",
  "error": "Not Found"
}
```

#### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

---

## 🧪 Testing Examples

### Complete Testing Script
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

# Test 3: Get product details
PRODUCT_ID=$(curl -s "$BASE_URL/products?limit=1" | jq -r '.products[0].id')
echo "3. Testing product details for ID: $PRODUCT_ID"
curl -s "$BASE_URL/products/$PRODUCT_ID" | jq '.name'

# Test 4: List brands
echo "4. Testing brand listing..."
curl -s "$BASE_URL/brands" | jq '.total'

# Test 5: Get brand details
BRAND_ID=$(curl -s "$BASE_URL/brands" | jq -r '.brands[0].id')
echo "5. Testing brand details for ID: $BRAND_ID"
curl -s "$BASE_URL/brands/$BRAND_ID" | jq '.name'

# Test 6: List stores
echo "6. Testing store listing..."
curl -s "$BASE_URL/stores" | jq '.total'

# Test 7: Get categories
echo "7. Testing categories..."
curl -s "$BASE_URL/categories" | jq '.categories | length'

# Test 8: Search suggestions
echo "8. Testing search suggestions..."
curl -s "$BASE_URL/search/suggestions?q=iPhone" | jq '.suggestions | length'

echo "✅ Public APIs testing completed!"
```

### Rate Limiting Test
```bash
#!/bin/bash
# Test rate limiting (100 requests per minute)

for i in {1..105}; do
  echo "Request $i"
  response=$(curl -s -w "%{http_code}" -X GET "http://localhost:3001/api/public/products")
  status_code="${response: -3}"
  echo "Status: $status_code"
  
  if [ "$status_code" = "429" ]; then
    echo "✅ Rate limiting working - got 429 at request $i"
    break
  fi
  
  # Small delay to avoid overwhelming
  sleep 0.1
done
```

---

## 🔧 Integration Examples

### JavaScript/React Integration
```javascript
// Public product browsing (no authentication required)
const fetchPublicProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/public/products?${params}`);
  return response.json();
};

// Search functionality
const searchProducts = async (query) => {
  const response = await fetch(`/api/public/products?search=${encodeURIComponent(query)}`);
  return response.json();
};

// Get search suggestions
const getSearchSuggestions = async (query) => {
  if (query.length < 2) return { suggestions: [] };
  const response = await fetch(`/api/public/search/suggestions?q=${encodeURIComponent(query)}`);
  return response.json();
};

// Example usage in React component
const ProductBrowser = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchPublicProducts({ limit: 12 });
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Component render logic...
};
```

### Vue.js Integration
```vue
<template>
  <div class="product-browser">
    <div v-if="loading">Loading products...</div>
    <div v-else>
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <span class="price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.hasStock" class="stock-info">
          Available at {{ product.storesAvailable }} store(s)
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      loading: false
    };
  },
  async mounted() {
    this.loading = true;
    try {
      const response = await fetch('/api/public/products?limit=12');
      const data = await response.json();
      this.products = data.products;
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
      }).format(price);
    }
  }
};
</script>
```

---

## 🎯 Use Cases

### E-commerce Storefront
- **Product Discovery**: Browse products without registration
- **Search & Filter**: Find specific products quickly
- **Brand Exploration**: Discover brands and their product lines
- **Store Locator**: Find stores carrying specific products

### Mobile App Integration
- **Guest Browsing**: Allow app users to explore before signing up
- **Search Suggestions**: Real-time search with autocomplete
- **Category Navigation**: Browse products by category
- **Store Information**: Display store details and contact info

### SEO & Marketing
- **Search Engine Optimization**: Public URLs for better SEO
- **Social Media Integration**: Shareable product and brand links
- **Content Marketing**: Category and brand pages for content strategy
- **Analytics Integration**: Track guest behavior and popular products

---

## 📊 Performance & Monitoring

### Expected Performance
- **Simple queries**: < 200ms response time
- **Complex queries with joins**: < 500ms response time
- **Search suggestions**: < 100ms response time
- **Image-heavy responses**: < 800ms response time

### Monitoring Recommendations
- Track response times for each endpoint
- Monitor rate limiting effectiveness
- Analyze popular search terms
- Track conversion from guest browsing to registration

---

## 🔐 Security Considerations

### Data Protection
- No sensitive data exposed in public responses
- User-specific information filtered out
- Admin-only fields not included
- Internal system details hidden

### Rate Limiting Strategy
- Protects against DoS attacks
- Ensures fair resource usage
- Prevents abuse of search functionality
- Maintains system performance

### Input Validation
- All query parameters validated
- SQL injection prevention via Prisma ORM
- XSS protection in error messages
- UUID format validation for IDs

---

## 🚀 Future Enhancements

### Planned Features
- **GraphQL Support**: Flexible query interface for public data
- **Advanced Filtering**: More sophisticated product filters
- **Personalization**: Anonymous user preference tracking
- **Real-time Stock**: WebSocket updates for stock availability
- **Recommendation Engine**: AI-powered product suggestions

### Performance Optimizations
- **Caching Strategy**: Redis caching for frequently accessed data
- **CDN Integration**: Content delivery network for images
- **Database Indexing**: Optimized indexes for search performance
- **API Response Compression**: Reduced bandwidth usage

---

**Goal**: Provide excellent user experience for guest visitors while maintaining security, performance, and data integrity standards. These public APIs enable product discovery and improve conversion rates by allowing users to explore before committing to registration.