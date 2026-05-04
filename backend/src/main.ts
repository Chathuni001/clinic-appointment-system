import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // (optional) CORS if frontend calls API
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  // Ensure uploads folder exists
  const uploadPath = join(process.cwd(), 'uploads');
  fs.mkdirSync(uploadPath, { recursive: true });

  // Serve static files
  app.useStaticAssets(uploadPath, {
    prefix: '/uploads',
  });

  await app.listen(3000);
}
bootstrap();