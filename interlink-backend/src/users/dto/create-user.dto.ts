import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securepassword123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'STORE_ADMIN',
    description: 'User role in the system',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({
    example: '456e7890-e89b-12d3-a456-426614174001',
    description: 'Store ID (required for store-related roles: STORE_ADMIN, STORE_STAFF)',
  })
  @IsOptional()
  @IsUUID()
  storeId?: string;
}