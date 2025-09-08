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
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('stores')
@Controller('stores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new store (Admin only)' })
  @ApiBody({ type: CreateStoreDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Store created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '456e7890-e89b-12d3-a456-426614174001' },
        name: { type: 'string', example: 'My Awesome Store' },
        slug: { type: 'string', example: 'my-awesome-store' },
        description: { type: 'string', example: 'A premium retail store offering quality products' },
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
        logo: { type: 'string', example: 'https://example.com/logo.png', nullable: true },
        status: { type: 'string', example: 'ACTIVE' },
        subscriptionStatus: { type: 'string', example: 'TRIAL' },
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
    description: 'Store slug already exists',
  })
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all stores (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all stores',
  })
  async findAll() {
    return this.storesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active stores only' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active stores',
  })
  async findActiveOnly() {
    return this.storesService.findActiveOnly();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID with details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store details with relationships',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const store = await this.storesService.findById(id);
    if (!store) {
      throw new Error('Store not found');
    }
    return store;
  }

  @Get(':id/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  @ApiOperation({ summary: 'Get store statistics (Admin/Store Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store statistics including user, brand, and order counts',
  })
  async getStoreStats(@Param('id', ParseUUIDPipe) id: string) {
    const stats = await this.storesService.getStoreStats(id);
    if (!stats) {
      throw new Error('Store not found');
    }
    return stats;
  }

  @Get(':id/brands')
  @ApiOperation({ summary: 'Get store brand entitlements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of brands this store has access to',
  })
  async getStoreBrands(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.getStoreBrands(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get store by slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store found by slug',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    const store = await this.storesService.findBySlug(slug);
    if (!store) {
      throw new Error('Store not found');
    }
    return store;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  @ApiOperation({ summary: 'Update store (Admin/Store Admin only)' })
  @ApiBody({ type: UpdateStoreDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '456e7890-e89b-12d3-a456-426614174001' },
        name: { type: 'string', example: 'My Updated Store' },
        slug: { type: 'string', example: 'my-updated-store' },
        description: { type: 'string', example: 'Updated store description' },
        email: { type: 'string', example: 'updated@example.com' },
        phone: { type: 'string', example: '+66-999-888-777' },
        logo: { type: 'string', example: 'https://example.com/new-logo.png' },
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
    description: 'Store not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete store (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Store deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.delete(id);
  }
}