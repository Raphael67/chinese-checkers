import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';
import { PlayerModule } from '../player/player.module';
import { BoardController } from './board.controller';
import { MoveService } from './board.service';
import { GamePlayer } from './game-player.entity';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { Move } from './move.entity';

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
        BoardController,
    ],
    providers: [
        GameService,
        MoveService,
    ],
})
export class GameModule { }
