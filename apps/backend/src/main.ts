import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS must be FIRST
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://ubiquitous-zebra-wv7ggxpwp5frrv-3000.app.github.dev',
      'https://aac-app-frontend.vercel.app/',
      'https://aacboard.work/',
      'https://staging.aacboard.work/',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept-Language',
    credentials: true,
  });

  // ✅ Then pipes, guards, interceptors, etc.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`Backend listening on http://localhost:${port}`);
}

bootstrap();
