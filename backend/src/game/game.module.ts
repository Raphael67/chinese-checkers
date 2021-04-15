import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from '../player/player.entity';
import { PlayerModule } from '../player/player.module';
import { PlayerRepository } from '../player/player.repository';
import { AIService } from './ai.service';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { CacheGameRepository } from './game-cache.repository';
import { DatabaseGameRepository } from './game-database.repository';
import { GamePlayer } from './game-player.entity';
import { GameController } from './game.controller';
import { GameEntity } from './game.entity';
import { GameService } from './game.service';
import { Move } from './move.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            GameEntity,
            PlayerEntity,
            GamePlayer,
            Move,
            DatabaseGameRepository,
            PlayerRepository,
        ]),
        PlayerModule,
    ],
    controllers: [
        GameController,
        BoardController,
    ],
    providers: [
        GameService,
        BoardService,
        AIService,
        CacheGameRepository,
    ],
})
export class GameModule { }
