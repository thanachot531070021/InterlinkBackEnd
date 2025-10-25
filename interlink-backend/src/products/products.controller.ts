import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  @ApiOperation({ summary: 'Create a new product (Admin/Store Admin only)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'product-uuid-789' },
        name: { type: 'string', example: 'iPhone 15 Pro' },
        slug: { type: 'string', example: 'iphone-15-pro' },
        sku: { type: 'string', example: 'APL-IPH15P-256-BLK' },
        description: { type: 'string', example: 'Latest iPhone with advanced camera system and A17 Pro chip' },
        brandId: { type: 'string', example: 'apple-brand-uuid' },
        createdByStoreId: { type: 'string', example: 'store-uuid-456', nullable: true },
        category: { type: 'string', example: 'Electronics' },
        price: { type: 'number', example: 39900.00 },
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
        status: { type: 'string', example: 'ACTIVE' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' },
        brand: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'apple-brand-uuid' },
            name: { type: 'string', example: 'Apple' },
            slug: { type: 'string', example: 'apple' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product SKU already exists',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all products (Public)',
    description: 'Public endpoint to browse all products without authentication - ideal for product discovery'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all products',
  })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  @Public()
  @ApiOperation({
    summary: 'Search products with filters (Public)',
    description: 'Public endpoint to search and filter products without authentication - supports multiple criteria'
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search text' })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter by brand ID' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Results offset' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated search results',
  })
  async searchProducts(@Query() query: any) {
    return this.productsService.searchProducts(query);
  }

  @Get('active')
  @Public()
  @ApiOperation({
    summary: 'Get active products only (Public)',
    description: 'Public endpoint to view active products without authentication - useful for browsing before login'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active products (public access)',
    schema: {
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
    }
  })
  async findActiveOnly() {
    return this.productsService.findActiveOnly();
  }

  @Get('brand/:brandId')
  @Public()
  @ApiOperation({
    summary: 'Get products by brand ID (Public)',
    description: 'Public endpoint to view all products from a specific brand without authentication'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of products for the specified brand',
  })
  async findByBrand(@Param('brandId', ParseUUIDPipe) brandId: string) {
    return this.productsService.findByBrand(brandId);
  }

  @Get('store/:storeId')
  @Public()
  @ApiOperation({
    summary: 'Get products created by specific store (Public)',
    description: 'Public endpoint to view products created by a specific store without authentication'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of store-created products',
  })
  async findByStore(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.productsService.findByStore(storeId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get product by ID with details (Public)',
    description: 'Public endpoint to view detailed product information without authentication'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product details with relationships',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  @ApiOperation({ summary: 'Get product statistics (Admin/Store Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product statistics including variants, stock, and sales data',
  })
  async getProductStats(@Param('id', ParseUUIDPipe) id: string) {
    const stats = await this.productsService.getProductStats(id);
    if (!stats) {
      throw new Error('Product not found');
    }
    return stats;
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({
    summary: 'Get product by slug (Public)',
    description: 'Public endpoint to find product using SEO-friendly slug without authentication'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product found by slug',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlug(slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  @Get('sku/:sku')
  @Public()
  @ApiOperation({
    summary: 'Get product by SKU (Public)',
    description: 'Public endpoint to find product using SKU code without authentication - useful for barcode scanning'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product found by SKU',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async findBySku(@Param('sku') sku: string) {
    const product = await this.productsService.findBySku(sku);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  @ApiOperation({ summary: 'Update product (Admin/Store Admin only)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'product-uuid-789' },
        name: { type: 'string', example: 'iPhone 15 Pro Updated' },
        slug: { type: 'string', example: 'iphone-15-pro' },
        sku: { type: 'string', example: 'APL-IPH15P-256-BLK' },
        description: { type: 'string', example: 'Updated: Latest iPhone with advanced camera system' },
        price: { type: 'number', example: 41900.00 },
        category: { type: 'string', example: 'Electronics' },
        images: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['https://example.com/new-image1.jpg']
        },
        status: { type: 'string', example: 'ACTIVE' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-25T16:45:00.000Z' },
        brand: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Apple' },
            slug: { type: 'string', example: 'apple' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.delete(id);
  }
}