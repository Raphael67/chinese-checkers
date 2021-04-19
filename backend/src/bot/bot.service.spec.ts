import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter } from 'events';
import { Game } from '../game/game.entity';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/game.module';
import { BotService } from './bot.service';

describe('AIService', () => {
    let service: BotService;
    const eventEmitter: EventEmitter = new EventEmitter();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: GAME_SERVICE_EVENT_TOKEN,
                    useValue: eventEmitter,
                },
                BotService,
            ],
        }).compile();

        service = module.get<BotService>(BotService);
    });
    describe('play', () => {
        it('should return a move', () => {
            const game = new Game();
            game.currentPlayer = 0;

            expect(service.play(game)).toBeInstanceOf(Array);
        });
    });
});
