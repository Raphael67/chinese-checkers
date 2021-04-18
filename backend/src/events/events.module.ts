import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { ConnectionRepository } from './connection.repository';
import { EventsGateway } from './events.gateway';

@Module({
    imports: [
        GameModule,
    ],
    providers: [
        EventsGateway,
        ConnectionRepository,
    ],
})
export class EventsModule { }
