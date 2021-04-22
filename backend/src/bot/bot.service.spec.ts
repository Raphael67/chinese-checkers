import { Test, TestingModule } from '@nestjs/testing';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/constants';
import { IGameEvents } from '../game/game-events.interface';
import { Game } from '../game/game.class';
import { BotService } from './bot.service';

describe('AIService', () => {
    let service: BotService;
    let eventEmitter: IGameEvents;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: GAME_SERVICE_EVENT_TOKEN,
                    useValue: {},
                },
                BotService,
            ],
        }).compile();

        service = module.get<BotService>(BotService);
        eventEmitter = module.get<IGameEvents>(GAME_SERVICE_EVENT_TOKEN);
    });
    describe('play', () => {
        it('should return a move', () => {
            const game = new Game();
            game.currentPlayer = 0;

            eventEmitter.on = jest.fn();

            expect(service.play(game)).toBeInstanceOf(Array);
        });
    });
});
