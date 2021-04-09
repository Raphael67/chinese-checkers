import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../game/game.service';
import { BoardController } from './board.controller';

class GameServiceMock extends GameService { }

describe('BoardController', () => {
    let controller: BoardController;
    let gameService: GameService = new GameServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BoardController],
            providers: [
                {
                    provide: GameService,
                    useValue: gameService
                }
            ]
        }).compile();

        controller = module.get<BoardController>(BoardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
