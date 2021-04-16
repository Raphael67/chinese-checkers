import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { CacheGameRepository } from './game-cache.repository';
import { DatabaseGameRepository } from './game-database.repository';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class BoardServiceMock extends BoardService { }
class DatabaseGameRepositoryMock extends DatabaseGameRepository { }
class CacheGameRepositoryMock extends CacheGameRepository { }

describe('BoardController', () => {
    let controller: BoardController;
    const gameService: GameService = new GameServiceMock();
    const boardService: BoardService = new BoardServiceMock();
    const databaseGameRepositoryMock: DatabaseGameRepository = new DatabaseGameRepositoryMock();
    const cacheGameRepositoryMock: CacheGameRepository = new CacheGameRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardController],
            providers: [
                {
                    provide: GameService,
                    useValue: gameService,
                },
                {
                    provide: BoardService,
                    useValue: boardService,
                },
                {
                    provide: DatabaseGameRepository,
                    useValue: databaseGameRepositoryMock,
                },
                {
                    provide: CacheGameRepository,
                    useValue: cacheGameRepositoryMock,
                },
            ],
        }).compile();

        controller = module.get<BoardController>(BoardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
