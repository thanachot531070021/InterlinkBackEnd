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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all products',
  })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products with filters' })
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
  @ApiOperation({ summary: 'Get active products only' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active products',
  })
  async findActiveOnly() {
    return this.productsService.findActiveOnly();
  }

  @Get('brand/:brandId')
  @ApiOperation({ summary: 'Get products by brand ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of products for the specified brand',
  })
  async findByBrand(@Param('brandId', ParseUUIDPipe) brandId: string) {
    return this.productsService.findByBrand(brandId);
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get products created by specific store' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of store-created products',
  })
  async findByStore(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.productsService.findByStore(storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID with details' })
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
  @ApiOperation({ summary: 'Get product by slug' })
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
  @ApiOperation({ summary: 'Get product by SKU' })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
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