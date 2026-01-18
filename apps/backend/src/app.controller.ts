import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getWelcome() {
    return {
      status: 'ok',
      message: 'AAC Backend API is running',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return { status: 'healthy' };
  }
}
