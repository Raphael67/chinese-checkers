import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayModule } from '../play/play.module';
import { Player } from '../player/player.entity';
import { PlayerModule } from '../player/player.module';
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
        forwardRef(() => PlayModule),
    ],
    controllers: [GameController],
    providers: [
        GameService,
    ],
    exports: [
        GameService,
    ]
})
export class GameModule { }
