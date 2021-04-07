import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }

describe('GameController', () => {
    let controller: GameController;
    let gameService: GameService = new GameServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameController],
            providers: [{
                provide: GameService,
                useValue: gameService,
            }],
        }).compile();

        controller = module.get<GameController>(GameController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
