import { Test, TestingModule } from '@nestjs/testing';
import { PlayerRepository } from './player-mogoose.repository';
import { PlayerService } from './player.service';

describe('PlayerService', () => {
    let service: PlayerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayerService,
                {
                    provide: PlayerRepository,
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<PlayerService>(PlayerService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });
});
