import { IsString, IsOptional, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Tech Gadgets',
    description: 'Brand name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'tech-gadgets',
    description: 'Brand URL slug (unique)',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'Latest technology and gadgets for modern life',
    description: 'Brand description',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'Brand logo URL',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the brand is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}