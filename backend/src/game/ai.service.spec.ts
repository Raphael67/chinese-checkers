import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter } from 'events';
import { AIService } from './ai.service';
import { Game } from './game.entity';
import { GAME_SERVICE_EVENT_TOKEN } from './game.module';

describe('AIService', () => {
    let service: AIService;
    const eventEmitter: EventEmitter = new EventEmitter();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: GAME_SERVICE_EVENT_TOKEN,
                    useValue: eventEmitter,
                },
                AIService,
            ],
        }).compile();

        service = module.get<AIService>(AIService);
    });
    describe('play', () => {
        it('should return a move', () => {
            const game = new Game();
            game.currentPlayer = 0;

            expect(service.play(game)).toBeInstanceOf(Array);
        });
    });
});
