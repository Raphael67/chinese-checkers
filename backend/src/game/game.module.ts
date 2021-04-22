import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitter } from 'events';
import { PlayerModule } from '../player/player.module';
import { GAME_SERVICE_EVENT_TOKEN } from './constants';
import { GameCacheRepository } from './game-cache.repository';
import { GameMongooseRepository } from './game-mongoose.repository';
import { GameController } from './game.controller';
import { GameEntity, GameSchema } from './game.entity';
import { GameService } from './game.service';

@Module({
    imports: [
        PlayerModule,
        MongooseModule.forFeature([
            {
                name: GameEntity.name,
                schema: GameSchema,
            },
        ]),
    ],
    controllers: [
        GameController,
    ],
    providers: [
        GameService,
        {
            provide: GAME_SERVICE_EVENT_TOKEN,
            useValue: new EventEmitter(),
        },
        GameCacheRepository,
        GameMongooseRepository,
    ],
    exports: [
        GameService,
        GAME_SERVICE_EVENT_TOKEN,
    ],
})
export class GameModule { }
