
import { Test, TestingModule } from '@nestjs/testing';
import { Game } from '../game/game.class';
import { GameService } from '../game/game.service';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

describe('BoardController', () => {
    let controller: BoardController;
    let gameService: GameService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                BoardController,
            ],
            providers: [
                {
                    provide: GameService,
                    useValue: {},
                },
                {
                    provide: BoardService,
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<BoardController>(BoardController);
        gameService = module.get<GameService>(GameService);
    });

    describe('getMoves', () => {
        it('should return all moves for a game', async () => {
            const game = new Game();
            game.moves = [[{ x: 0, y: 1 }, { x: 1, y: 1 }]];
            gameService.loadGame = jest.fn<Promise<Game>, []>(async () => game);

            await expect(controller.getMoves(game.id)).resolves.toHaveLength(1);
        });
    });
});
