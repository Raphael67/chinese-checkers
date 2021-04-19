
import { Test, TestingModule } from '@nestjs/testing';
import { CacheGameRepository } from '../game/game-cache.repository';
import { Game } from '../game/game.class';
import { GameService } from '../game/game.service';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

class BoardServiceMock extends BoardService { }
class CacheGameRepositoryMock extends CacheGameRepository { }

describe('BoardController', () => {
    let controller: BoardController;
    const boardService: BoardService = new BoardServiceMock();
    const cacheGameRepository: CacheGameRepository = new CacheGameRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: GameService,
                    useValue: jest.fn(),
                },
                {
                    provide: BoardService,
                    useValue: boardService,
                },
                {
                    provide: CacheGameRepository,
                    useValue: cacheGameRepository,
                },
                {
                    provide: BoardController,
                    useFactory: (gameService, boardService, cacheGameRepository) => {
                        return new BoardController(
                            gameService, boardService, cacheGameRepository
                        );
                    },
                    inject: [GameService, BoardService, CacheGameRepository],
                },
            ],
        }).compile();

        controller = module.get<BoardController>(BoardController);
    });

    describe('getMoves', () => {
        it('should return all moves for a game', async () => {
            const game = new Game();
            game.moves = [[{ x: 0, y: 1 }, { x: 1, y: 1 }]];
            cacheGameRepository.findOne = jest.fn<Game, []>(() => game);

            await expect(controller.getMoves(game.id)).resolves.toHaveLength(1);
        });
    });
});
