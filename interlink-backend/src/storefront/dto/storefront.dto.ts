import { IsString, IsOptional, IsNumber, Min, Max, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class StorefrontSearchDto {
  @IsString()
  storeSlug: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 24;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'price' | 'created' = 'name';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'asc';
}

export class ProductDetailDto {
  @IsString()
  storeSlug: string;

  @IsString()
  productSlug: string;
}

export class StoreContactDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  storeSlug?: string;
}

export class ProductAvailabilityDto {
  @IsString()
  storeSlug: string;

  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variantIds?: string[];
}