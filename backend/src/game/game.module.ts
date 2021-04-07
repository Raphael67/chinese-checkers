import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';
import { GameMoves } from './game-moves.entity';
import { GamePlayer } from './game-player.entity';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Game,
            Player,
            GamePlayer,
            GameMoves,
            GameRepository,
        ])
    ],
    controllers: [GameController],
    providers: [
        GameService
    ]
})
export class GameModule { }
