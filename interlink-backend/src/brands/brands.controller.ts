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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Brand created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all brands',
  })
  async findAll() {
    return this.brandsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active brands only' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active brands',
  })
  async findActiveOnly() {
    return this.brandsService.findActiveOnly();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get brand by ID with details' })
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
  @ApiOperation({ summary: 'Get brand by slug' })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand updated successfully',
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