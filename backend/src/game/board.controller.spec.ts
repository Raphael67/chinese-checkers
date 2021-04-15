import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class BoardServiceMock extends BoardService { }


describe('BoardController', () => {
    let controller: BoardController;
    const gameService: GameService = new GameServiceMock();
    const boardService: BoardService = new BoardServiceMock();

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
            ],
        }).compile();

        controller = module.get<BoardController>(BoardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
