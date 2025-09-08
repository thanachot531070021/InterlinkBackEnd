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
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier' })
  @ApiResponse({ status: 200, description: 'Store information retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async getStoreInfo(@Param('storeSlug') storeSlug: string) {
    return this.storefrontService.getStoreInfo(storeSlug);
  }

  @Get(':storeSlug/products')
  @ApiOperation({ summary: 'Get store product catalog' })
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for products' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter by brand ID' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price filter' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of products per page (default: 24)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset (default: 0)' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'price', 'created'], description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Product catalog retrieved successfully' })
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
  @ApiParam({ name: 'storeSlug', description: 'Store slug identifier' })
  @ApiParam({ name: 'productSlug', description: 'Product slug identifier' })
  @ApiResponse({ status: 200, description: 'Product details retrieved successfully' })
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