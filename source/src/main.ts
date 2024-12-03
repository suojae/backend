import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('NestJS로 작성된 API 문서입니다.')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // /api 경로에서 Swagger UI를 제공

  await app.listen(port);
}

bootstrap();
