import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';
import { PlayerModule } from '../player/player.module';
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
        ]),
        PlayerModule,
    ],
    controllers: [GameController],
    providers: [
        GameService
    ]
})
export class GameModule { }
