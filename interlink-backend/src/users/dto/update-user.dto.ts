import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsEnum, IsUUID, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John Smith Updated',
    description: 'Updated full name of the user',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the user account is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'STORE_STAFF',
    description: 'Updated user role',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    example: '789e0123-e89b-12d3-a456-426614174002',
    description: 'Updated store ID (for store-related roles)',
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;
}