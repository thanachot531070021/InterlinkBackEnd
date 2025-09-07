import { IsString, IsInt, Min, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty({
    description: 'Store ID',
    example: 'store-uuid-123',
  })
  @IsUUID()
  storeId: string;

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
    description: 'Available quantity',
    example: 100,
  })
  @IsInt()
  @Min(0)
  availableQty: number;

  @ApiProperty({
    description: 'Central price',
    example: 1500.00,
  })
  priceCentral: number;

  @ApiPropertyOptional({
    description: 'Store-specific price (optional)',
    example: 1650.00,
  })
  @IsOptional()
  priceStore?: number;
}

export class UpdateStockDto {
  @ApiPropertyOptional({
    description: 'Available quantity',
    example: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  availableQty?: number;

  @ApiPropertyOptional({
    description: 'Central price',
    example: 1500.00,
  })
  @IsOptional()
  priceCentral?: number;

  @ApiPropertyOptional({
    description: 'Store-specific price',
    example: 1650.00,
  })
  @IsOptional()
  priceStore?: number;
}

export class ReserveStockDto {
  @ApiProperty({
    description: 'Store ID',
    example: 'store-uuid-123',
  })
  @IsUUID()
  storeId: string;

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
    description: 'Quantity to reserve',
    example: 5,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Order ID for this reservation',
    example: 'order-uuid-123',
  })
  @IsUUID()
  orderId: string;

  @ApiPropertyOptional({
    description: 'Reservation expiry in minutes (default: 60)',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  expiryMinutes?: number;
}

export class ReleaseReservationDto {
  @ApiProperty({
    description: 'Reservation ID to release',
    example: 'reservation-uuid-123',
  })
  @IsUUID()
  reservationId: string;
}

export class StockAdjustmentDto {
  @ApiProperty({
    description: 'Stock ID',
    example: 'stock-uuid-123',
  })
  @IsUUID()
  stockId: string;

  @ApiProperty({
    description: 'Quantity adjustment (positive or negative)',
    example: -5,
  })
  @IsInt()
  adjustment: number;

  @ApiProperty({
    description: 'Reason for adjustment',
    example: 'Damage during shipping',
  })
  @IsString()
  reason: string;
}