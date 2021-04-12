import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { MoveService } from './board.service';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class MoveServiceMock extends MoveService { }


describe('BoardController', () => {
    let controller: BoardController;
    const gameService: GameService = new GameServiceMock();
    const moveService: MoveService = new MoveServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardController],
            providers: [
                {
                    provide: GameService,
                    useValue: gameService,
                },
                {
                    provide: MoveService,
                    useValue: moveService,
                },
            ],
        }).compile();

        controller = module.get<BoardController>(BoardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
