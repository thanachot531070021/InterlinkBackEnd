import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Interlink Backend API is running! 🚀';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Interlink Backend API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}