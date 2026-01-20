import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getWelcome() {
    return {
      status: 'ok',
      message: 'AAC Backend API is running',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health')
  getHealth() {
    return { status: 'healthy' };
  }
}
