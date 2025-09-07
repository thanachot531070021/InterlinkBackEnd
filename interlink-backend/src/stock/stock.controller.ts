import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { StockService } from './stock.service';
import {
  CreateStockDto,
  UpdateStockDto,
  ReserveStockDto,
  ReleaseReservationDto,
  StockAdjustmentDto,
} from './dto/stock.dto';

@ApiTags('stock')
@Controller('api/stock')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('store/:storeId')
  @ApiOperation({
    summary: 'Get all stock for a store',
    description: 'Retrieve all stock records for a specific store with product details',
  })
  @ApiParam({
    name: 'storeId',
    description: 'Store UUID',
    example: 'store-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Store stock retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'stock-uuid-123' },
          availableQty: { type: 'number', example: 100 },
          reservedQty: { type: 'number', example: 5 },
          soldQty: { type: 'number', example: 20 },
          priceCentral: { type: 'number', example: 1500.00 },
          priceStore: { type: 'number', example: 1650.00 },
          product: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'iPhone 15 Pro' },
              sku: { type: 'string', example: 'APL-IPH15P-128' },
              brand: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string', example: 'Apple' },
                  slug: { type: 'string', example: 'apple' },
                },
              },
            },
          },
        },
      },
    },
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async getStoreStock(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.stockService.getStoreStock(storeId);
  }

  @Get('store/:storeId/product/:productId')
  @ApiOperation({
    summary: 'Get stock for a specific product',
    description: 'Retrieve stock record for a specific product/variant in a store',
  })
  @ApiParam({ name: 'storeId', description: 'Store UUID' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiQuery({
    name: 'variantId',
    description: 'Product variant UUID (optional)',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Product stock retrieved successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async getProductStock(
    @Param('storeId', ParseUUIDPipe) storeId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('variantId') variantId?: string,
  ) {
    return this.stockService.getProductStock(storeId, productId, variantId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create or update stock',
    description: 'Create new stock record or update existing one',
  })
  @ApiResponse({
    status: 201,
    description: 'Stock created/updated successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  async createOrUpdateStock(@Body() createStockDto: CreateStockDto) {
    return this.stockService.createOrUpdateStock(createStockDto);
  }

  @Put(':stockId')
  @ApiOperation({
    summary: 'Update existing stock',
    description: 'Update an existing stock record',
  })
  @ApiParam({ name: 'stockId', description: 'Stock UUID' })
  @ApiResponse({
    status: 200,
    description: 'Stock updated successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  async updateStock(
    @Param('stockId', ParseUUIDPipe) stockId: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.updateStock(stockId, updateStockDto);
  }

  @Post('reserve')
  @ApiOperation({
    summary: 'Reserve stock for order',
    description: 'Atomically reserve stock for an order with TTL expiration',
  })
  @ApiResponse({
    status: 201,
    description: 'Stock reserved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'reservation-uuid-123' },
        quantity: { type: 'number', example: 5 },
        expiresAt: { type: 'string', format: 'date-time' },
        status: { type: 'string', example: 'ACTIVE' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Insufficient stock available',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async reserveStock(@Body() reserveStockDto: ReserveStockDto) {
    return this.stockService.reserveStock(reserveStockDto);
  }

  @Post('release-reservation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Release stock reservation',
    description: 'Release a stock reservation (on order cancellation)',
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation released successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async releaseReservation(@Body() releaseReservationDto: ReleaseReservationDto) {
    return this.stockService.releaseReservation(releaseReservationDto.reservationId);
  }

  @Post('confirm-reservation/:reservationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm stock reservation',
    description: 'Convert reservation to sale (on order confirmation)',
  })
  @ApiParam({ name: 'reservationId', description: 'Reservation UUID' })
  @ApiResponse({
    status: 200,
    description: 'Reservation confirmed and stock updated',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async confirmReservation(@Param('reservationId', ParseUUIDPipe) reservationId: string) {
    return this.stockService.confirmReservation(reservationId);
  }

  @Post('adjust')
  @ApiOperation({
    summary: 'Manual stock adjustment',
    description: 'Manually adjust stock for corrections, damage, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock adjusted successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  async adjustStock(@Body() stockAdjustmentDto: StockAdjustmentDto) {
    return this.stockService.adjustStock(stockAdjustmentDto);
  }

  @Get('reservations/expired')
  @ApiOperation({
    summary: 'Get expired reservations',
    description: 'Get all expired reservations for cleanup',
  })
  @ApiResponse({
    status: 200,
    description: 'Expired reservations retrieved',
  })
  @Roles(UserRole.ADMIN)
  async getExpiredReservations() {
    return this.stockService.getExpiredReservations();
  }

  @Post('cleanup-expired')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cleanup expired reservations',
    description: 'Automatically release all expired reservations',
  })
  @ApiResponse({
    status: 200,
    description: 'Expired reservations cleaned up',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  @Roles(UserRole.ADMIN)
  async cleanupExpiredReservations() {
    return this.stockService.cleanupExpiredReservations();
  }

  @Get('store/:storeId/stats')
  @ApiOperation({
    summary: 'Get store stock statistics',
    description: 'Get comprehensive stock statistics for a store',
  })
  @ApiParam({ name: 'storeId', description: 'Store UUID' })
  @ApiResponse({
    status: 200,
    description: 'Store stock statistics retrieved',
    schema: {
      type: 'object',
      properties: {
        totalProducts: { type: 'number', example: 150 },
        lowStockItems: { type: 'number', example: 12 },
        outOfStockItems: { type: 'number', example: 3 },
        inStockItems: { type: 'number', example: 147 },
        totalUnits: { type: 'number', example: 2500 },
      },
    },
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async getStoreStockStats(@Param('storeId', ParseUUIDPipe) storeId: string) {
    return this.stockService.getStoreStockStats(storeId);
  }
}