import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from '../player/player.service';
import { GameController } from './game.controller';
import { GameService } from './game.service';

class GameServiceMock extends GameService { }
class PlayerServiceMock extends PlayerService { }

describe('GameController', () => {
    let controller: GameController;
    let gameService: GameService = new GameServiceMock();
    let playerService: PlayerService = new PlayerServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GameController],
            providers: [
                {
                    provide: GameService,
                    useValue: gameService,
                },
                {
                    provide: PlayerService,
                    useValue: playerService,
                }
            ],
        }).compile();

        controller = module.get<GameController>(GameController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
