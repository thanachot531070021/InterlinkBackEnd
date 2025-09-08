import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { StorefrontService } from './storefront.service';
import { StorefrontSearchDto, ProductDetailDto, ProductAvailabilityDto } from './dto/storefront.dto';

@ApiTags('Storefront (Public)')
@Controller('storefront')
@UseGuards(ThrottlerGuard) // Rate limiting for public endpoints
export class StorefrontController {
  constructor(private storefrontService: StorefrontService) {}

  @Get(':storeSlug')
  @ApiOperation({ summary: 'Get store information' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier', example: 'my-awesome-store' })
  @ApiResponse({ 
    status: 200, 
    description: 'Store information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '456e7890-e89b-12d3-a456-426614174001' },
        name: { type: 'string', example: 'My Awesome Store' },
        slug: { type: 'string', example: 'my-awesome-store' },
        description: { type: 'string', example: 'A premium retail store offering quality products' },
        logo: { type: 'string', example: 'https://example.com/logo.png' },
        email: { type: 'string', example: 'store@example.com' },
        phone: { type: 'string', example: '+66-123-456-789' },
        address: {
          type: 'object',
          example: {
            street: '123 Main Street',
            city: 'Bangkok',
            province: 'Bangkok',
            postalCode: '10110',
            country: 'Thailand'
          }
        },
        socialLinks: {
          type: 'object',
          example: {
            facebook: 'https://facebook.com/mystore',
            instagram: 'https://instagram.com/mystore',
            line: 'https://line.me/ti/p/mystore'
          }
        },
        status: { type: 'string', example: 'ACTIVE' },
        isActive: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStoreInfo(@Param('storeSlug') storeSlug: string) {
    return this.storefrontService.getStoreInfo(storeSlug);
  }

  @Get(':storeSlug/products')
  @ApiOperation({ summary: 'Get store product catalog' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier', example: 'my-awesome-store' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for products', example: 'iPhone' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category', example: 'Electronics' })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter by brand ID', example: 'brand-uuid-789' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter', example: 1000 })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter', example: 50000 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products per page (default: 24)', example: 24 })
  @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset (default: 0)', example: 0 })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'price', 'created'], description: 'Sort field', example: 'price' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order', example: 'asc' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product catalog retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'product-uuid-789' },
              name: { type: 'string', example: 'iPhone 15 Pro' },
              slug: { type: 'string', example: 'iphone-15-pro' },
              sku: { type: 'string', example: 'APL-IPH15P-256-BLK' },
              description: { type: 'string', example: 'Latest iPhone with advanced camera system' },
              category: { type: 'string', example: 'Electronics' },
              images: {
                type: 'array',
                items: { type: 'string' },
                example: ['https://example.com/iphone15pro-1.jpg']
              },
              storePrice: { type: 'number', example: 39900.00 },
              availableQty: { type: 'number', example: 15 },
              brand: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'brand-uuid-789' },
                  name: { type: 'string', example: 'Apple' },
                  slug: { type: 'string', example: 'apple' }
                }
              }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 150 },
            limit: { type: 'number', example: 24 },
            offset: { type: 'number', example: 0 },
            hasMore: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStoreProducts(
    @Param('storeSlug') storeSlug: string,
    @Query() searchDto: Omit<StorefrontSearchDto, 'storeSlug'>,
  ) {
    return this.storefrontService.getStoreProducts({
      storeSlug,
      ...searchDto,
    });
  }

  @Get(':storeSlug/products/:productSlug')
  @ApiOperation({ summary: 'Get product details' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier', example: 'my-awesome-store' })
  @ApiParam({ name: 'productSlug', description: 'Product slug identifier', example: 'iphone-15-pro' })
  @ApiResponse({ 
    status: 200, 
    description: 'Product details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'product-uuid-789' },
        name: { type: 'string', example: 'iPhone 15 Pro' },
        slug: { type: 'string', example: 'iphone-15-pro' },
        sku: { type: 'string', example: 'APL-IPH15P-256-BLK' },
        description: { type: 'string', example: 'Latest iPhone with advanced camera system and A17 Pro chip' },
        category: { type: 'string', example: 'Electronics' },
        images: {
          type: 'array',
          items: { type: 'string' },
          example: ['https://example.com/iphone15pro-1.jpg', 'https://example.com/iphone15pro-2.jpg']
        },
        attributes: {
          type: 'object',
          example: {
            color: 'Black',
            storage: '256GB',
            connectivity: '5G'
          }
        },
        storePrice: { type: 'number', example: 39900.00 },
        availableQty: { type: 'number', example: 15 },
        isInStock: { type: 'boolean', example: true },
        brand: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'brand-uuid-789' },
            name: { type: 'string', example: 'Apple' },
            slug: { type: 'string', example: 'apple' },
            logo: { type: 'string', example: 'https://example.com/apple-logo.png' }
          }
        },
        relatedProducts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'product-uuid-790' },
              name: { type: 'string', example: 'iPhone 15' },
              slug: { type: 'string', example: 'iphone-15' },
              storePrice: { type: 'number', example: 32900.00 },
              images: {
                type: 'array',
                items: { type: 'string' },
                example: ['https://example.com/iphone15-1.jpg']
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Store or product not found' })
  async getProductDetail(
    @Param('storeSlug') storeSlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    return this.storefrontService.getProductDetail({ storeSlug, productSlug });
  }

  @Post(':storeSlug/products/check-availability')
  @ApiOperation({ summary: 'Check product availability' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier' })
  @ApiResponse({ status: 200, description: 'Product availability checked successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async checkProductAvailability(
    @Param('storeSlug') storeSlug: string,
    @Body(ValidationPipe) availabilityDto: Omit<ProductAvailabilityDto, 'storeSlug'>,
  ) {
    return this.storefrontService.checkProductAvailability({
      storeSlug,
      ...availabilityDto,
    });
  }

  @Get(':storeSlug/categories')
  @ApiOperation({ summary: 'Get store categories' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier' })
  @ApiResponse({ status: 200, description: 'Store categories retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStoreCategories(@Param('storeSlug') storeSlug: string) {
    return this.storefrontService.getStoreCategories(storeSlug);
  }

  @Get(':storeSlug/brands')
  @ApiOperation({ summary: 'Get store brands' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier' })
  @ApiResponse({ status: 200, description: 'Store brands retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStoreBrands(@Param('storeSlug') storeSlug: string) {
    return this.storefrontService.getStoreBrands(storeSlug);
  }

  @Get(':storeSlug/search/suggestions')
  @ApiOperation({ summary: 'Get search suggestions (autocomplete)' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier' })
  @ApiQuery({ name: 'q', description: 'Search query (minimum 2 characters)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of suggestions (default: 10)' })
  @ApiResponse({ status: 200, description: 'Search suggestions retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getSearchSuggestions(
    @Param('storeSlug') storeSlug: string,
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.storefrontService.getSearchSuggestions(storeSlug, query, limit);
  }

  @Get('products/all')
  @ApiOperation({ 
    summary: 'Get all active products (Public access)', 
    description: 'Public endpoint to browse all active products without authentication - useful for product catalog browsing'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All active products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'product-uuid-789' },
              name: { type: 'string', example: 'iPhone 15 Pro' },
              slug: { type: 'string', example: 'iphone-15-pro' },
              sku: { type: 'string', example: 'APL-IPH15P-256-BLK' },
              description: { type: 'string', example: 'Latest iPhone with advanced camera system' },
              category: { type: 'string', example: 'Electronics' },
              price: { type: 'number', example: 39900.00 },
              images: {
                type: 'array',
                items: { type: 'string' },
                example: ['https://example.com/iphone15pro-1.jpg']
              },
              brand: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'brand-uuid-789' },
                  name: { type: 'string', example: 'Apple' },
                  slug: { type: 'string', example: 'apple' }
                }
              },
              status: { type: 'string', example: 'ACTIVE' },
              isActive: { type: 'boolean', example: true }
            }
          }
        },
        total: { type: 'number', example: 150 }
      }
    }
  })
  async getAllActiveProducts() {
    return this.storefrontService.getAllActiveProducts();
  }

  // Health check for storefront
  @Get('health')
  @ApiOperation({ summary: 'Storefront health check' })
  @ApiResponse({ status: 200, description: 'Storefront is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'storefront',
    };
  }
}