import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { EntitlementsModule } from './entitlements/entitlements.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per minute
    }]),
    
    // Database
    DatabaseModule,
    
    // Core modules
    AuthModule,
    UsersModule,
    
    // Business Logic modules
    BrandsModule,
    StoresModule,
    ProductsModule,
    EntitlementsModule,
    
    // TODO: Add other modules as we implement them
    // etc.
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}