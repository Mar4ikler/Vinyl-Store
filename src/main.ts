import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './logger/logger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true
    });
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
        .setTitle('Vinyl Store')
        .setDescription('The vinyl store API description')
        .setVersion('1.0')
        .addBearerAuth(undefined, 'Bearer Auth')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(4000);
}
bootstrap();
