import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game/game.service';
import { ConnectionRepository } from './connection.repository';
import { EventsGateway } from './events.gateway';

describe('EventsGateway', () => {
    let gateway: EventsGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsGateway,
                {
                    provide: GameService,
                    useValue: jest.fn(),
                },
                {
                    provide: ConnectionRepository,
                    useValue: jest.fn(),
                },
            ],
        }).compile();

        gateway = module.get<EventsGateway>(EventsGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
