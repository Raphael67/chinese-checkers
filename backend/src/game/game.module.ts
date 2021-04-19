import { Module } from '@nestjs/common';
import { EventEmitter } from 'events';
import { BoardController } from '../board/board.controller';
import { BoardService } from '../board/board.service';
import { PlayerModule } from '../player/player.module';
import { PlayerService } from '../player/player.service';
import { CacheGameRepository } from './game-cache.repository';
import { IGameEvents } from './game-events.interface';
import { GameController } from './game.controller';
import { GameService } from './game.service';

export const GAME_SERVICE_EVENT_TOKEN = Symbol('GAME_SERVICE_EVENT_TOKEN');
@Module({
    imports: [
        PlayerModule,
    ],
    controllers: [
        GameController,
        BoardController,
    ],
    providers: [
        {
            provide: GAME_SERVICE_EVENT_TOKEN,
            useValue: new EventEmitter(),
        },
        {
            provide: GameService,
            useFactory: (eventEmitter: IGameEvents, playerService: PlayerService, cacheGameRepository: CacheGameRepository) => {
                return new GameService(
                    cacheGameRepository,
                    playerService,
                    eventEmitter,
                );
            },
            inject: [
                GAME_SERVICE_EVENT_TOKEN,
                PlayerService,
                CacheGameRepository,
            ],
        },
        BoardService,
        CacheGameRepository,
    ],
    exports: [
        CacheGameRepository,
        GameService,
        GAME_SERVICE_EVENT_TOKEN,
    ],
})
export class GameModule { }
