import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';
import { PlayerModule } from '../player/player.module';
import { BoardController } from './board.controller';
import { GamePlayer } from './game-player.entity';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { MoveController } from './move.controller';
import { Move } from './move.entity';
import { MoveService } from './move.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Game,
            Player,
            GamePlayer,
            Move,
            GameRepository,
        ]),
        PlayerModule,
    ],
    controllers: [
        GameController,
        MoveController,
        BoardController,
    ],
    providers: [
        GameService,
        MoveService,
    ],
})
export class GameModule { }
