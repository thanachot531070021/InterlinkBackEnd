import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Length, 
  Matches,
  IsEnum,
  IsUUID,
  IsNumber,
  Min,
  IsDecimal,
} from 'class-validator';
import { ProductStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ 
    description: 'Product name', 
    example: 'iPhone 15 Pro',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ 
    description: 'Product slug (URL-friendly identifier)', 
    example: 'iphone-15-pro',
    pattern: '^[a-z0-9-]+$'
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({ 
    description: 'Product SKU (Stock Keeping Unit)', 
    example: 'APL-IPH15P-256-BLK',
    minLength: 3,
    maxLength: 50
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  sku: string;

  @ApiPropertyOptional({ 
    description: 'Product description', 
    example: 'Latest iPhone with advanced camera system and A17 Pro chip',
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({ 
    description: 'Brand ID this product belongs to', 
    example: 'uuid-string'
  })
  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @ApiPropertyOptional({ 
    description: 'Store ID that created this product (null for central products)', 
    example: 'uuid-string'
  })
  @IsOptional()
  @IsUUID()
  createdByStoreId?: string;

  @ApiProperty({ 
    description: 'Product category', 
    example: 'Electronics'
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  category: string;

  @ApiProperty({ 
    description: 'Product price', 
    example: 39900.00,
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ 
    description: 'Product images (JSON array)', 
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
  })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ 
    description: 'Product attributes (JSON object)', 
    example: {
      color: 'Black',
      storage: '256GB',
      connectivity: '5G'
    }
  })
  @IsOptional()
  attributes?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Product status', 
    enum: ProductStatus,
    default: ProductStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}