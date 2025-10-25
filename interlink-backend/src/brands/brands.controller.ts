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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('brands')
@Controller('brands')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new brand (Admin only)' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Brand created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'brand-uuid-123' },
        name: { type: 'string', example: 'Tech Gadgets' },
        slug: { type: 'string', example: 'tech-gadgets' },
        description: { type: 'string', example: 'Latest technology and gadgets for modern life' },
        logo: { type: 'string', example: 'https://example.com/logo.png', nullable: true },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' }
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
    description: 'Brand slug already exists',
  })
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all brands (Public)',
    description: 'Public endpoint to browse all brands without authentication - no login required'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all brands',
  })
  async findAll() {
    return this.brandsService.findAll();
  }

  @Get('active')
  @Public()
  @ApiOperation({
    summary: 'Get active brands only (Public)',
    description: 'Public endpoint to browse active brands without authentication - perfect for storefront display'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active brands',
  })
  async findActiveOnly() {
    return this.brandsService.findActiveOnly();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get brand by ID with details (Public)',
    description: 'Public endpoint to view brand details and products without authentication'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand details with relationships',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const brand = await this.brandsService.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get brand statistics (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand statistics including product and store counts',
  })
  async getBrandStats(@Param('id', ParseUUIDPipe) id: string) {
    const stats = await this.brandsService.getBrandStats(id);
    if (!stats) {
      throw new Error('Brand not found');
    }
    return stats;
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({
    summary: 'Get brand by slug (Public)',
    description: 'Public endpoint to find brand using SEO-friendly slug without authentication'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand found by slug',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    const brand = await this.brandsService.findBySlug(slug);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update brand (Admin only)' })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'brand-uuid-123' },
        name: { type: 'string', example: 'Tech Gadgets Updated' },
        slug: { type: 'string', example: 'tech-gadgets' },
        description: { type: 'string', example: 'Updated: Latest technology and gadgets for modern life' },
        logo: { type: 'string', example: 'https://example.com/updated-logo.png' },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-25T16:45:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete brand (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.delete(id);
  }
}