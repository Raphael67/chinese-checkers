import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from '../board/board.service';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/constants';
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
                    provide: BoardService,
                    useValue: jest.fn(),
                },
                {
                    provide: ConnectionRepository,
                    useValue: jest.fn(),
                },
                {
                    provide: GAME_SERVICE_EVENT_TOKEN,
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
