import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter } from 'events';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/constants';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import consoleConfiguration from './console.configuration';
import { ConsoleService } from './console.service';

@Module({
    imports: [
        ConfigModule.forFeature(consoleConfiguration),
        GameModule,
        PlayerModule,
    ],
    controllers: [
        BoardController,
    ],
    providers: [
        {
            provide: GAME_SERVICE_EVENT_TOKEN,
            useValue: new EventEmitter(),
        },
        BoardService,
        ConsoleService,
    ],
    exports: [
        BoardService,
        GAME_SERVICE_EVENT_TOKEN,
    ],
})
export class BoardModule { }