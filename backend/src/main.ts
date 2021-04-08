import { DatabaseService } from '@corteks/nest-database';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const configSerice = app.get<ConfigService>(ConfigService);
    const databaseService = app.get<DatabaseService>(DatabaseService);
    await databaseService.migrate();

    const config = new DocumentBuilder()
        .setTitle('Chinese checkers')
        .setDescription('The chinese checkers API description')
        .setVersion(configSerice.getVersion())
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(8080);
}
bootstrap();
