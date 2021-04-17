import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

class PlayerServiceMock extends PlayerService { }

describe('PlayerController', () => {
    let controller: PlayerController;
    const playerService: PlayerService = new PlayerServiceMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlayerController],
            providers: [{
                provide: PlayerService,
                useValue: playerService,
            }],
        }).compile();

        controller = module.get<PlayerController>(PlayerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
