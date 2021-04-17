import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { CacheGameRepository } from './game-cache.repository';
import { Game } from './game.entity';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class BoardServiceMock extends BoardService { }
class CacheGameRepositoryMock extends CacheGameRepository { }

describe('BoardController', () => {
    let controller: BoardController;
    let gameService: GameService;
    const boardService: BoardService = new BoardServiceMock();
    const cacheGameRepositoryMock: CacheGameRepository = new CacheGameRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardController],
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
                    useValue: cacheGameRepositoryMock,
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
            cacheGameRepositoryMock.findOne = jest.fn<Game, []>(() => game);

            await expect(controller.getMoves(game.id)).resolves.toHaveLength(1);
        });
    });
});
