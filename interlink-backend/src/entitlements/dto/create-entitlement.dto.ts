import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsUUID,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { PricingMode } from '@prisma/client';

export class CreateStoreBrandEntitlementDto {
  @ApiProperty({ 
    description: 'Store ID to grant brand access to', 
    example: 'uuid-string'
  })
  @IsNotEmpty()
  @IsUUID()
  storeId: string;

  @ApiProperty({ 
    description: 'Brand ID to grant access to', 
    example: 'uuid-string'
  })
  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @ApiPropertyOptional({ 
    description: 'Pricing mode for this brand-store relationship', 
    enum: PricingMode,
    default: PricingMode.CENTRAL
  })
  @IsOptional()
  @IsEnum(PricingMode)
  pricingMode?: PricingMode;

  @ApiPropertyOptional({ 
    description: 'When this entitlement becomes effective (ISO date)', 
    example: '2025-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ 
    description: 'When this entitlement expires (ISO date)', 
    example: '2025-12-31T23:59:59.999Z'
  })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}