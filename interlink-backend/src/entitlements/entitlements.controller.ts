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
import { EntitlementsService } from './entitlements.service';
import { CreateStoreBrandEntitlementDto } from './dto/create-entitlement.dto';
import { UpdateStoreBrandEntitlementDto } from './dto/update-entitlement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('store-brand-entitlements')
@Controller('entitlements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EntitlementsController {
  constructor(private readonly entitlementsService: EntitlementsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new store-brand entitlement (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Entitlement created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createEntitlementDto: CreateStoreBrandEntitlementDto) {
    return this.entitlementsService.create(createEntitlementDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all store-brand entitlements (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all store-brand entitlements',
  })
  async findAll() {
    return this.entitlementsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active store-brand entitlements' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active store-brand entitlements',
  })
  async findActiveEntitlements() {
    return this.entitlementsService.findActiveEntitlements();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get entitlement statistics (Admin only)' })
  @ApiQuery({ name: 'storeId', required: false, description: 'Filter by store ID' })
  @ApiQuery({ name: 'brandId', required: false, description: 'Filter by brand ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entitlement statistics',
  })
  async getStats(@Query('storeId') storeId?: string, @Query('brandId') brandId?: string) {
    return this.entitlementsService.getEntitlementStats(storeId, brandId);
  }

  @Get('store/:storeId')
  @ApiOperation({ summary: 'Get entitlements for a specific store' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of entitlements for the store',
  })
  async findByStore(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.entitlementsService.findByStore(storeId);
  }

  @Get('store/:storeId/active')
  @ApiOperation({ summary: 'Get active entitlements for a specific store' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active entitlements for the store',
  })
  async findActiveByStore(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.entitlementsService.findActiveByStore(storeId);
  }

  @Get('brand/:brandId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get entitlements for a specific brand (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of entitlements for the brand',
  })
  async findByBrand(@Param('brandId', ParseUUIDPipe) brandId: string) {
    return this.entitlementsService.findByBrand(brandId);
  }

  @Get('brand/:brandId/active')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get active entitlements for a specific brand (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active entitlements for the brand',
  })
  async findActiveByBrand(@Param('brandId', ParseUUIDPipe) brandId: string) {
    return this.entitlementsService.findActiveByBrand(brandId);
  }

  @Get('check/:storeId/:brandId')
  @ApiOperation({ summary: 'Check if store has access to brand' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Boolean indicating if store has brand access',
  })
  async checkEntitlement(
    @Param('storeId', ParseUUIDPipe) storeId: string,
    @Param('brandId', ParseUUIDPipe) brandId: string
  ) {
    const hasAccess = await this.entitlementsService.checkEntitlement(storeId, brandId);
    return { hasAccess };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entitlement by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entitlement details',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Entitlement not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const entitlement = await this.entitlementsService.findById(id);
    if (!entitlement) {
      throw new Error('Entitlement not found');
    }
    return entitlement;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update entitlement (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entitlement updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Entitlement not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEntitlementDto: UpdateStoreBrandEntitlementDto,
  ) {
    return this.entitlementsService.update(id, updateEntitlementDto);
  }

  @Patch(':id/revoke')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Revoke entitlement (set expiry to now) (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entitlement revoked successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Entitlement not found',
  })
  async revoke(@Param('id', ParseUUIDPipe) id: string) {
    return this.entitlementsService.revokeEntitlement(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete entitlement (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Entitlement deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Entitlement not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.entitlementsService.delete(id);
  }
}