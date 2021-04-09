import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamePlayer } from '../game/game-player.entity';
import { Game } from '../game/game.entity';
import { GameModule } from '../game/game.module';
import { GameRepository } from '../game/game.repository';
import { Player } from '../player/player.entity';
import { AccessService } from './access.service';
import { BoardController } from './board.controller';
import { EventsGateway } from './events/events.gateway';
import { MoveController } from './move.controller';
import { Move } from './move.entity';
import { MoveService } from './move.service';

@Module({
    controllers: [
        BoardController,
        MoveController,
    ],
    imports: [
        TypeOrmModule.forFeature([
            Game,
            GameRepository,
            GamePlayer,
            Player,
            Move,
        ]),
        forwardRef(() => GameModule)
    ],
    providers: [
        EventsGateway,
        AccessService,
        MoveService,
    ]
})
export class PlayModule { }
