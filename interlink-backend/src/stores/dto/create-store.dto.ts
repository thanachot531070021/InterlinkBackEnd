import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Length, 
  Matches,
  IsEnum,
} from 'class-validator';
import { StoreStatus, SubscriptionStatus } from '@prisma/client';

export class CreateStoreDto {
  @ApiProperty({ 
    description: 'Store name', 
    example: 'My Awesome Store',
    minLength: 2,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ 
    description: 'Store slug (URL-friendly identifier)', 
    example: 'my-awesome-store',
    pattern: '^[a-z0-9-]+$'
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiPropertyOptional({ 
    description: 'Store description', 
    example: 'A premium retail store offering quality products',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ 
    description: 'Store email address', 
    example: 'store@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ 
    description: 'Store phone number', 
    example: '+66-123-456-789'
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Store address (JSON object)', 
    example: {
      street: '123 Main Street',
      city: 'Bangkok',
      province: 'Bangkok',
      postalCode: '10110',
      country: 'Thailand'
    }
  })
  @IsOptional()
  address?: Record<string, any>;

  @ApiPropertyOptional({ 
    description: 'Store logo URL', 
    example: 'https://example.com/logo.png'
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiPropertyOptional({ 
    description: 'Store status', 
    enum: StoreStatus,
    default: StoreStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(StoreStatus)
  status?: StoreStatus;

  @ApiPropertyOptional({ 
    description: 'Subscription status', 
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIAL
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscriptionStatus?: SubscriptionStatus;
}