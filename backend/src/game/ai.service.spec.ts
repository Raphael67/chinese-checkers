import { Test, TestingModule } from '@nestjs/testing';
import { AIService } from './ai.service';
import { Game } from './game.class';

describe('AIService', () => {
    let service: AIService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AIService,
            ],
        }).compile();

        service = module.get<AIService>(AIService);
    });
    describe('play', () => {
        it('should return a move', () => {
            const game = new Game();
            game.nextPlayer();

            expect(service.play(game)).toBeInstanceOf(Array);
        });
    });
});
