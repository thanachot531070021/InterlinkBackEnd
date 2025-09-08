# Storefront APIs (Public)

## Overview

Storefront APIs provide public access to store information and product catalogs for customer-facing applications. These APIs are designed for public access without authentication and include rate limiting for protection.

**Base URL**: `/storefront`

## Authentication

**Not Required** - These are public APIs designed for customer access.

## Rate Limiting

All storefront endpoints are rate-limited to prevent abuse:
- **General requests**: 100 requests per minute per IP
- **Search requests**: 60 requests per minute per IP

---

## Endpoints

### 1. Get Store Information

Retrieve public information about a store.

**Endpoint**: `GET /storefront/{storeSlug}`  
**Rate Limited**: Yes  
**Public Access**: Yes

#### Request
```bash
curl -X GET "http://localhost:3001/storefront/tech-paradise"
```

#### Response
```json
{
  "id": "store-uuid-123",
  "name": "Tech Paradise Store",
  "slug": "tech-paradise",
  "description": "Your one-stop shop for all tech gadgets and accessories",
  "email": "info@techparadise.com",
  "phone": "+66-123-456-789",
  "address": {
    "street": "456 Technology Ave",
    "city": "Bangkok",
    "province": "Bangkok",
    "postalCode": "10200",
    "country": "Thailand"
  },
  "logo": "https://example.com/tech-paradise-logo.png",
  "status": "ACTIVE",
  "isActive": true,
  "operatingHours": {
    "monday": "09:00-18:00",
    "tuesday": "09:00-18:00",
    "wednesday": "09:00-18:00",
    "thursday": "09:00-18:00",
    "friday": "09:00-18:00",
    "saturday": "10:00-16:00",
    "sunday": "closed"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/techparadise",
    "instagram": "https://instagram.com/techparadise",
    "line": "@techparadise"
  },
  "stats": {
    "totalProducts": 156,
    "activeProducts": 142,
    "categoriesCount": 12,
    "brandsCount": 8
  }
}
```

#### Error Response
```json
// 404 Not Found - Store not found or inactive
{
  "statusCode": 404,
  "message": "Store not found or not available",
  "error": "Not Found"
}
```

---

### 2. Get Store Product Catalog

Retrieve the product catalog for a specific store with filtering and pagination.

**Endpoint**: `GET /storefront/{storeSlug}/products`  
**Rate Limited**: Yes  
**Public Access**: Yes

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search term for product names and descriptions |
| category | string | Filter by product category |
| brandId | string | Filter by brand UUID |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| limit | number | Number of products per page (default: 24, max: 100) |
| offset | number | Pagination offset (default: 0) |
| sortBy | enum | Sort by: 'name', 'price', 'created' (default: 'name') |
| sortOrder | enum | Sort order: 'asc', 'desc' (default: 'asc') |

#### Request Examples
```bash
# Get all products
curl -X GET "http://localhost:3001/storefront/tech-paradise/products"

# Search products
curl -X GET "http://localhost:3001/storefront/tech-paradise/products?search=iPhone"

# Filter by category and price range
curl -X GET "http://localhost:3001/storefront/tech-paradise/products?category=Smartphones&minPrice=20000&maxPrice=50000"

# Sort by price descending
curl -X GET "http://localhost:3001/storefront/tech-paradise/products?sortBy=price&sortOrder=desc&limit=12"

# Filter by brand
curl -X GET "http://localhost:3001/storefront/tech-paradise/products?brandId=apple-brand-uuid"
```

#### Response
```json
{
  "store": {
    "id": "store-uuid-123",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise",
    "logo": "https://example.com/tech-paradise-logo.png"
  },
  "products": [
    {
      "id": "product-uuid-456",
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "sku": "APL-IPH15P-256-BLK",
      "description": "Latest iPhone with advanced camera system and A17 Pro chip",
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
      },
      "brand": {
        "id": "apple-brand-uuid",
        "name": "Apple",
        "slug": "apple",
        "logo": "https://example.com/apple-logo.png"
      },
      "availability": {
        "inStock": true,
        "quantity": 15,
        "status": "AVAILABLE"
      }
    },
    {
      "id": "product-uuid-789",
      "name": "MacBook Pro 14-inch",
      "slug": "macbook-pro-14-inch",
      "sku": "APL-MBP14-512-SG",
      "description": "Powerful MacBook Pro with M3 chip",
      "category": "Laptops",
      "price": 89900.00,
      "images": ["https://example.com/macbook-1.jpg"],
      "brand": {
        "id": "apple-brand-uuid",
        "name": "Apple",
        "slug": "apple",
        "logo": "https://example.com/apple-logo.png"
      },
      "availability": {
        "inStock": true,
        "quantity": 8,
        "status": "AVAILABLE"
      }
    }
  ],
  "pagination": {
    "total": 142,
    "offset": 0,
    "limit": 24,
    "hasMore": true,
    "totalPages": 6,
    "currentPage": 1
  },
  "filters": {
    "search": null,
    "category": null,
    "brandId": null,
    "minPrice": null,
    "maxPrice": null,
    "appliedCount": 0
  }
}
```

---

### 3. Get Product Details

Retrieve detailed information about a specific product in a store.

**Endpoint**: `GET /storefront/{storeSlug}/products/{productSlug}`  
**Rate Limited**: Yes  
**Public Access**: Yes

#### Request
```bash
curl -X GET "http://localhost:3001/storefront/tech-paradise/products/iphone-15-pro"
```

#### Response
```json
{
  "product": {
    "id": "product-uuid-456",
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "sku": "APL-IPH15P-256-BLK",
    "description": "The most advanced iPhone yet. Featuring the powerful A17 Pro chip, revolutionary camera system with 48MP main camera, and titanium design. Available in multiple storage options and colors.",
    "category": "Smartphones",
    "price": 39900.00,
    "images": [
      "https://example.com/iphone15pro-1.jpg",
      "https://example.com/iphone15pro-2.jpg",
      "https://example.com/iphone15pro-3.jpg",
      "https://example.com/iphone15pro-4.jpg"
    ],
    "attributes": {
      "color": "Natural Titanium",
      "storage": "256GB",
      "connectivity": "5G",
      "display": "6.1-inch Super Retina XDR",
      "processor": "A17 Pro chip",
      "camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      "weight": "187g",
      "dimensions": "146.6 x 70.6 x 8.25 mm",
      "warranty": "1 Year Apple Warranty"
    },
    "brand": {
      "id": "apple-brand-uuid",
      "name": "Apple",
      "slug": "apple",
      "description": "American multinational technology company",
      "logo": "https://example.com/apple-logo.png"
    },
    "availability": {
      "inStock": true,
      "quantity": 15,
      "status": "AVAILABLE",
      "estimatedDelivery": "1-2 business days",
      "reservationInfo": {
        "maxReservationMinutes": 60,
        "allowGuestReservation": true
      }
    },
    "variants": [
      {
        "id": "variant-uuid-1",
        "name": "iPhone 15 Pro 128GB Natural Titanium",
        "attributes": {"storage": "128GB", "color": "Natural Titanium"},
        "price": 34900.00,
        "sku": "APL-IPH15P-128-NT",
        "availability": {"inStock": true, "quantity": 12}
      },
      {
        "id": "variant-uuid-2",
        "name": "iPhone 15 Pro 256GB Black Titanium",
        "attributes": {"storage": "256GB", "color": "Black Titanium"},
        "price": 39900.00,
        "sku": "APL-IPH15P-256-BT",
        "availability": {"inStock": true, "quantity": 8}
      }
    ]
  },
  "store": {
    "id": "store-uuid-123",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise",
    "email": "info@techparadise.com",
    "phone": "+66-123-456-789",
    "logo": "https://example.com/tech-paradise-logo.png"
  },
  "relatedProducts": [
    {
      "id": "product-uuid-related-1",
      "name": "iPhone 15 Pro Case",
      "slug": "iphone-15-pro-case",
      "price": 1299.00,
      "images": ["https://example.com/case-1.jpg"],
      "brand": {"name": "Apple", "slug": "apple"}
    }
  ],
  "specifications": {
    "technical": {
      "processor": "A17 Pro chip with 6-core CPU",
      "display": "6.1-inch Super Retina XDR OLED",
      "camera": "Triple camera system with 48MP, 12MP, 12MP",
      "battery": "Up to 23 hours video playback",
      "storage": "256GB",
      "connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3"
    },
    "physical": {
      "dimensions": "146.6 x 70.6 x 8.25 mm",
      "weight": "187g",
      "materials": "Titanium frame, Ceramic Shield front",
      "colors": "Natural Titanium, Blue Titanium, White Titanium, Black Titanium"
    }
  }
}
```

---

### 4. Check Product Availability

Check real-time availability for multiple products.

**Endpoint**: `POST /storefront/{storeSlug}/products/check-availability`  
**Rate Limited**: Yes  
**Public Access**: Yes

#### Request Body
```json
{
  "items": [
    {
      "productId": "product-uuid-456",
      "variantId": "variant-uuid-1",
      "quantity": 2
    },
    {
      "productId": "product-uuid-789",
      "quantity": 1
    }
  ]
}
```

#### Request Example
```bash
curl -X POST "http://localhost:3001/storefront/tech-paradise/products/check-availability" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "iphone-product-uuid",
        "quantity": 2
      },
      {
        "productId": "macbook-product-uuid", 
        "quantity": 1
      }
    ]
  }'
```

#### Response
```json
{
  "store": {
    "id": "store-uuid-123",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "availability": [
    {
      "productId": "iphone-product-uuid",
      "variantId": null,
      "requestedQuantity": 2,
      "available": true,
      "availableQuantity": 15,
      "status": "AVAILABLE",
      "product": {
        "name": "iPhone 15 Pro",
        "sku": "APL-IPH15P-256-BLK",
        "price": 39900.00
      }
    },
    {
      "productId": "macbook-product-uuid",
      "variantId": null,
      "requestedQuantity": 1,
      "available": true,
      "availableQuantity": 8,
      "status": "AVAILABLE",
      "product": {
        "name": "MacBook Pro 14-inch",
        "sku": "APL-MBP14-512-SG",
        "price": 89900.00
      }
    }
  ],
  "summary": {
    "allAvailable": true,
    "totalItems": 2,
    "availableItems": 2,
    "unavailableItems": 0,
    "estimatedTotal": 169700.00
  },
  "checkedAt": "2024-01-20T15:30:00.000Z"
}
```

---

### 5. Get Store Categories

Retrieve all product categories available in the store.

**Endpoint**: `GET /storefront/{storeSlug}/categories`  
**Rate Limited**: Yes  
**Public Access**: Yes

#### Request
```bash
curl -X GET "http://localhost:3001/storefront/tech-paradise/categories"
```

#### Response
```json
{
  "store": {
    "id": "store-uuid-123",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "categories": [
    {
      "name": "Smartphones",
      "productCount": 25,
      "priceRange": {
        "min": 8990.00,
        "max": 59900.00
      },
      "topBrands": ["Apple", "Samsung", "Google"]
    },
    {
      "name": "Laptops",
      "productCount": 18,
      "priceRange": {
        "min": 25990.00,
        "max": 189900.00
      },
      "topBrands": ["Apple", "Dell", "HP", "Lenovo"]
    },
    {
      "name": "Tablets",
      "productCount": 12,
      "priceRange": {
        "min": 12990.00,
        "max": 89900.00
      },
      "topBrands": ["Apple", "Samsung"]
    },
    {
      "name": "Accessories",
      "productCount": 87,
      "priceRange": {
        "min": 299.00,
        "max": 15990.00
      },
      "topBrands": ["Apple", "Belkin", "Anker"]
    }
  ],
  "summary": {
    "totalCategories": 4,
    "totalProducts": 142
  }
}
```

---

### 6. Get Store Brands

Retrieve all brands available in the store.

**Endpoint**: `GET /storefront/{storeSlug}/brands`  
**Rate Limited**: Yes  
**Public Access**: Yes

#### Request
```bash
curl -X GET "http://localhost:3001/storefront/tech-paradise/brands"
```

#### Response
```json
{
  "store": {
    "id": "store-uuid-123",
    "name": "Tech Paradise Store",
    "slug": "tech-paradise"
  },
  "brands": [
    {
      "id": "apple-brand-uuid",
      "name": "Apple",
      "slug": "apple",
      "description": "American multinational technology company",
      "logo": "https://example.com/apple-logo.png",
      "productCount": 35,
      "categories": ["Smartphones", "Laptops", "Tablets", "Accessories"],
      "priceRange": {
        "min": 1299.00,
        "max": 189900.00
      }
    },
    {
      "id": "samsung-brand-uuid",
      "name": "Samsung",
      "slug": "samsung",
      "description": "South Korean multinational electronics company",
      "logo": "https://example.com/samsung-logo.png",
      "productCount": 28,
      "categories": ["Smartphones", "Tablets", "Accessories"],
      "priceRange": {
        "min": 899.00,
        "max": 79900.00
      }
    }
  ],
  "summary": {
    "totalBrands": 8,
    "totalProducts": 142,
    "featuredBrands": 2
  }
}
```

---

### 7. Get Search Suggestions (Autocomplete)

Get search suggestions for product autocomplete functionality.

**Endpoint**: `GET /storefront/{storeSlug}/search/suggestions`  
**Rate Limited**: Yes (60 requests/minute)  
**Public Access**: Yes

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (minimum 2 characters) |
| limit | number | No | Number of suggestions (default: 10, max: 20) |

#### Request Examples
```bash
# Get suggestions for "iPh"
curl -X GET "http://localhost:3001/storefront/tech-paradise/search/suggestions?q=iPh&limit=5"

# Get suggestions for "MacBook"
curl -X GET "http://localhost:3001/storefront/tech-paradise/search/suggestions?q=MacBook"
```

#### Response
```json
{
  "query": "iPh",
  "suggestions": [
    {
      "type": "product",
      "text": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "category": "Smartphones",
      "price": 39900.00,
      "image": "https://example.com/iphone15pro-thumb.jpg"
    },
    {
      "type": "product",
      "text": "iPhone 15",
      "slug": "iphone-15",
      "category": "Smartphones",
      "price": 29900.00,
      "image": "https://example.com/iphone15-thumb.jpg"
    },
    {
      "type": "category",
      "text": "iPhone Cases",
      "category": "Accessories",
      "productCount": 12
    },
    {
      "type": "brand",
      "text": "iPhone Accessories",
      "brand": "Apple",
      "productCount": 8
    }
  ],
  "count": 4,
  "executionTime": "12ms"
}
```

---

### 8. Health Check

Check if the storefront service is operational.

**Endpoint**: `GET /storefront/health`  
**Rate Limited**: No  
**Public Access**: Yes

#### Request
```bash
curl -X GET "http://localhost:3001/storefront/health"
```

#### Response
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T15:30:00.000Z",
  "service": "storefront",
  "version": "1.0.0",
  "uptime": "5d 12h 30m",
  "environment": "production"
}
```

---

## Common Use Cases

### 1. Build Store Homepage
```bash
# Get store info
curl -X GET "http://localhost:3001/storefront/my-store"

# Get featured products
curl -X GET "http://localhost:3001/storefront/my-store/products?limit=12&sortBy=created&sortOrder=desc"

# Get categories for navigation
curl -X GET "http://localhost:3001/storefront/my-store/categories"
```

### 2. Product Search Page
```bash
# Search products
curl -X GET "http://localhost:3001/storefront/my-store/products?search=laptop&sortBy=price&sortOrder=asc"

# Get search suggestions
curl -X GET "http://localhost:3001/storefront/my-store/search/suggestions?q=lap"
```

### 3. Product Detail Page
```bash
# Get product details
curl -X GET "http://localhost:3001/storefront/my-store/products/macbook-pro-14-inch"

# Check availability
curl -X POST "http://localhost:3001/storefront/my-store/products/check-availability" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": "product-uuid", "quantity": 1}]}'
```

### 4. Shopping Cart Validation
```bash
# Validate cart items before checkout
curl -X POST "http://localhost:3001/storefront/my-store/products/check-availability" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": "product-1", "quantity": 2},
      {"productId": "product-2", "variantId": "variant-1", "quantity": 1}
    ]
  }'
```

---

## Error Handling

### Common Error Responses

#### 404 Not Found - Store Not Found
```json
{
  "statusCode": 404,
  "message": "Store not found or not available",
  "error": "Not Found"
}
```

#### 404 Not Found - Product Not Found
```json
{
  "statusCode": 404,
  "message": "Product not found in this store",
  "error": "Not Found"
}
```

#### 429 Too Many Requests - Rate Limited
```json
{
  "statusCode": 429,
  "message": "Too many requests. Please try again later.",
  "error": "Too Many Requests",
  "retryAfter": 60
}
```

#### 400 Bad Request - Invalid Query
```json
{
  "statusCode": 400,
  "message": "Search query must be at least 2 characters",
  "error": "Bad Request"
}
```

---

## Performance Considerations

### Caching Strategy
- **Store Info**: Cached for 1 hour
- **Product Catalog**: Cached for 15 minutes
- **Product Details**: Cached for 30 minutes
- **Categories/Brands**: Cached for 4 hours

### Optimization Tips
1. **Use Pagination**: Always use appropriate limit values
2. **Specific Filters**: Use category/brand filters to reduce result sets
3. **Image Optimization**: Use appropriate image sizes for listings vs details
4. **Minimize Requests**: Batch related data in single requests when possible

---

## Integration Examples

### JavaScript/Frontend Integration
```javascript
// Store API client
class StorefrontAPI {
  constructor(baseURL, storeSlug) {
    this.baseURL = baseURL;
    this.storeSlug = storeSlug;
  }

  async getProducts(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/storefront/${this.storeSlug}/products?${params}`);
    return response.json();
  }

  async getProduct(productSlug) {
    const response = await fetch(`${this.baseURL}/storefront/${this.storeSlug}/products/${productSlug}`);
    return response.json();
  }

  async checkAvailability(items) {
    const response = await fetch(`${this.baseURL}/storefront/${this.storeSlug}/products/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    return response.json();
  }
}

// Usage
const api = new StorefrontAPI('http://localhost:3001', 'tech-paradise');
const products = await api.getProducts({ category: 'Smartphones', limit: 24 });
```

---

## Notes

1. **Public Access**: No authentication required for any storefront endpoint
2. **Rate Limiting**: All endpoints are rate-limited per IP address
3. **Store Status**: Only active stores are accessible via storefront APIs
4. **Real-time Data**: Product availability is checked in real-time
5. **SEO Friendly**: All responses include structured data for search engines
6. **Mobile Optimized**: Responses include mobile-specific data where relevant
7. **Caching Headers**: Responses include appropriate cache headers for CDN optimization