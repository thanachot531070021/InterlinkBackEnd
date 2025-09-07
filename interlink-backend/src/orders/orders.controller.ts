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
  ParseIntPipe,
  DefaultValuePipe,
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
import { UserRole, OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderSearchDto,
  OrderStatsDto,
} from './dto/orders.dto';

@ApiTags('orders')
@Controller('api/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new order',
    description: 'Create a new order with automatic stock reservation',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully with stock reserved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'order-uuid-123' },
        status: { type: 'string', example: 'PENDING' },
        totalAmount: { type: 'number', example: 3000.00 },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              quantity: { type: 'number' },
              unitPrice: { type: 'number' },
              totalPrice: { type: 'number' },
              product: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string', example: 'iPhone 15 Pro' },
                  sku: { type: 'string', example: 'APL-IPH15P-128' },
                },
              },
            },
          },
        },
        reservations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              quantity: { type: 'number' },
              expiresAt: { type: 'string', format: 'date-time' },
              status: { type: 'string', example: 'ACTIVE' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Insufficient stock for one or more items',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search orders',
    description: 'Search orders with various filters and pagination',
  })
  @ApiQuery({ name: 'storeId', required: false, description: 'Store UUID to filter by' })
  @ApiQuery({ name: 'customerId', required: false, description: 'Customer UUID to filter by' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Order status to filter by' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by customer name or email' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Date from (ISO string)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Date to (ISO string)' })
  @ApiQuery({ name: 'offset', required: false, type: 'number', description: 'Number of results to skip' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Number of results to return' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              totalAmount: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              customer: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
              store: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                },
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            offset: { type: 'number' },
            limit: { type: 'number' },
            hasMore: { type: 'boolean' },
          },
        },
      },
    },
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async searchOrders(@Query() searchDto: OrderSearchDto) {
    return this.ordersService.searchOrders(searchDto);
  }

  @Get('store/:storeId')
  @ApiOperation({
    summary: 'Get store orders',
    description: 'Get all orders for a specific store',
  })
  @ApiParam({ name: 'storeId', description: 'Store UUID' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Number of results' })
  @ApiQuery({ name: 'offset', required: false, type: 'number', description: 'Results to skip' })
  @ApiResponse({
    status: 200,
    description: 'Store orders retrieved successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async getStoreOrders(
    @Param('storeId', ParseUUIDPipe) storeId: string,
    @Query('status') status?: OrderStatus,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.ordersService.getStoreOrders(storeId, status, limit, offset);
  }

  @Get('customer/:customerId')
  @ApiOperation({
    summary: 'Get customer orders',
    description: 'Get all orders for a specific customer',
  })
  @ApiParam({ name: 'customerId', description: 'Customer UUID' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', description: 'Number of results' })
  @ApiQuery({ name: 'offset', required: false, type: 'number', description: 'Results to skip' })
  @ApiResponse({
    status: 200,
    description: 'Customer orders retrieved successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async getCustomerOrders(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.ordersService.getCustomerOrders(customerId, limit, offset);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get order statistics',
    description: 'Get comprehensive order statistics with optional filters',
  })
  @ApiQuery({ name: 'storeId', required: false, description: 'Store UUID to filter by' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Date from (ISO string)' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'Date to (ISO string)' })
  @ApiResponse({
    status: 200,
    description: 'Order statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalOrders: { type: 'number', example: 150 },
        pendingOrders: { type: 'number', example: 12 },
        confirmedOrders: { type: 'number', example: 120 },
        cancelledOrders: { type: 'number', example: 8 },
        completedOrders: { type: 'number', example: 110 },
        totalRevenue: { type: 'number', example: 450000.00 },
        averageOrderValue: { type: 'number', example: 3000.00 },
        conversionRate: { type: 'number', example: 88.67 },
      },
    },
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  async getOrderStats(@Query() statsDto: OrderStatsDto) {
    return this.ordersService.getOrderStats(statsDto);
  }

  @Get('attention')
  @ApiOperation({
    summary: 'Get orders needing attention',
    description: 'Get orders with expired reservations or other issues',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders needing attention retrieved',
    schema: {
      type: 'object',
      properties: {
        expiredReservationOrders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              totalAmount: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              customer: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        totalNeedingAttention: { type: 'number' },
      },
    },
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  async getOrdersNeedingAttention() {
    return this.ordersService.getOrdersNeedingAttention();
  }

  @Get(':orderId')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Get detailed order information including items and reservations',
  })
  @ApiParam({ name: 'orderId', description: 'Order UUID' })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'order-uuid-123' },
        status: { type: 'string', example: 'PENDING' },
        totalAmount: { type: 'number', example: 3000.00 },
        notes: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        confirmedAt: { type: 'string', format: 'date-time' },
        customer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'object' },
          },
        },
        store: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
          },
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              quantity: { type: 'number' },
              unitPrice: { type: 'number' },
              totalPrice: { type: 'number' },
              product: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  sku: { type: 'string' },
                  brand: { type: 'object' },
                },
              },
            },
          },
        },
        reservations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              quantity: { type: 'number' },
              expiresAt: { type: 'string', format: 'date-time' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN, UserRole.STORE_STAFF)
  async getOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.ordersService.getOrder(orderId);
  }

  @Put(':orderId/status')
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update order status with automatic stock handling',
  })
  @ApiParam({ name: 'orderId', description: 'Order UUID' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  async updateOrderStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateStatusDto);
  }

  @Post(':orderId/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel order',
    description: 'Cancel order with automatic stock reservation release',
  })
  @ApiParam({ name: 'orderId', description: 'Order UUID' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully and stock released',
  })
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  async cancelOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body('reason') reason?: string,
  ) {
    return this.ordersService.cancelOrder(orderId, reason);
  }

  @Post('cleanup-expired')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cleanup expired orders',
    description: 'Automatically cancel orders with expired reservations',
  })
  @ApiResponse({
    status: 200,
    description: 'Expired orders cleaned up successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  @Roles(UserRole.ADMIN)
  async cleanupExpiredOrders() {
    return this.ordersService.cleanupExpiredOrders();
  }
}