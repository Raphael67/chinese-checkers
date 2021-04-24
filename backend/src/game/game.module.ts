import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from '../player/player.module';
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
        GameCacheRepository,
        GameMongooseRepository,
    ],
    exports: [
        GameService,
    ],
})
export class GameModule { }
