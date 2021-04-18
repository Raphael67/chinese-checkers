import { Module } from '@nestjs/common';
import { BoardModule } from '../board/board.module';
import { GameModule } from '../game/game.module';
import { ConnectionRepository } from './connection.repository';
import { EventsGateway } from './events.gateway';

@Module({
    imports: [
        GameModule,
        BoardModule,
    ],
    providers: [
        EventsGateway,
        ConnectionRepository,
    ],
})
export class EventsModule { }
