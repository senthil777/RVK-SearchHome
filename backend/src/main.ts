import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Modified Helmet for Development: Allows Swagger inline scripts to execute
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'public'));
  
  // CORS updated to handle dynamic environments like GitHub Codespaces smoothly
  app.enableCors({
    origin: parseCorsOrigins(configService.get<string>('CORS_ORIGIN')),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('MyApp Authentication API')
    .setDescription('NestJS authentication API with JWT, Prisma, and Supabase PostgreSQL.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  
  // Swagger Configuration Setup
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { 
      persistAuthorization: true,
    },
    // Fixes the asset paths inside reverse proxies like Codespaces
    useGlobalPrefix: true, 
  });

  const port = configService.get<number>('PORT') ?? 3000;
  
  // 🟢 CRITICAL FIX: Added '0.0.0.0' to bind the network host interface globally
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 NestJS application is listening globally on port ${port}`);
}

function parseCorsOrigins(value?: string): string[] | boolean {
  if (!value || value.trim() === '*') {
    return true;
  }

  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

bootstrap();