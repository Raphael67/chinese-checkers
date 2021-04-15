import { DatabaseService } from '@corteks/nest-database';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { GamePlayer } from './game/game-player.entity';
import { GameEntity } from './game/game.entity';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const configSerice = app.get<ConfigService>(ConfigService);
    const databaseService = app.get<DatabaseService>(DatabaseService);
    await databaseService.migrate();

    const gameRepository = app.get<Repository<GameEntity>>(getRepositoryToken(GameEntity));
    const game = await gameRepository.findOne('5f7468f7-4a9a-400b-bda9-aba65ee139c6', {
        relations: ['gamePlayers'],
    });
    const gamePlayer = new GamePlayer();
    gamePlayer.game = game;
    gamePlayer.playerId = 12;
    gamePlayer.position = 2;
    game.gamePlayers.push(gamePlayer);
    await gameRepository.save(game);

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
