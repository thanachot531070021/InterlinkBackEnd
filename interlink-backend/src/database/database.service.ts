import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.log('⚠️ Database connection failed - continuing in development mode');
      console.log('💡 To setup database, see: SETUP-WITHOUT-DOCKER.md');
      // Continue without database for development
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('✅ Database disconnected');
  }

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  // Transaction helper
  async transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }
}