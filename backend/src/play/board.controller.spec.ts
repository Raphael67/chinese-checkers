import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game/game.service';
import { BoardController } from './board.controller';
import { MoveService } from './move.service';

class GameServiceMock extends GameService { }
class MoveServiceMock extends MoveService { }


describe('BoardController', () => {
    let controller: BoardController;
    let gameService: GameService = new GameServiceMock();
    let moveService: MoveService = new MoveServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardController],
            providers: [
                {
                    provide: GameService,
                    useValue: gameService
                },
                {
                    provide: MoveService,
                    useValue: moveService,
                }
            ]
        }).compile();

        controller = module.get<BoardController>(BoardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
