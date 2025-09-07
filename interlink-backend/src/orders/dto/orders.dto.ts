import { IsString, IsArray, IsInt, IsUUID, IsOptional, ValidateNested, Min, IsEmail, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'product-uuid-123',
  })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({
    description: 'Product variant ID (if applicable)',
    example: 'variant-uuid-123',
  })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({
    description: 'Quantity to order',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price at time of order',
    example: 1500.00,
  })
  unitPrice: number;
}

export class CustomerInfoDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+66-81-123-4567',
  })
  @IsPhoneNumber('TH')
  phone: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Customer address',
    example: {
      street: '123 Main Street',
      city: 'Bangkok',
      province: 'Bangkok',
      postalCode: '10110',
      country: 'Thailand',
    },
  })
  address: {
    street: string;
    city: string;
    province?: string;
    postalCode: string;
    country: string;
  };
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Store ID',
    example: 'store-uuid-123',
  })
  @IsUUID()
  storeId: string;

  @ApiProperty({
    description: 'Customer information',
    type: CustomerInfoDto,
  })
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customer: CustomerInfoDto;

  @ApiProperty({
    description: 'Order items',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional({
    description: 'Order notes',
    example: 'Please deliver in the morning',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Reservation expiry in minutes (default: 60)',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  reservationMinutes?: number;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  status: OrderStatus;

  @ApiPropertyOptional({
    description: 'Cancellation reason (if status is CANCELLED)',
    example: 'Customer requested cancellation',
  })
  @IsOptional()
  @IsString()
  cancelReason?: string;
}

export class OrderSearchDto {
  @ApiPropertyOptional({
    description: 'Store ID to filter by',
    example: 'store-uuid-123',
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Customer ID to filter by',
    example: 'customer-uuid-123',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Order status to filter by',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Search by customer name or email',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Date from (ISO string)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Date to (ISO string)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Number of results to skip',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 50,
    default: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}

export class OrderStatsDto {
  @ApiPropertyOptional({
    description: 'Store ID to get stats for',
    example: 'store-uuid-123',
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Date from for stats period',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Date to for stats period',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  dateTo?: string;
}