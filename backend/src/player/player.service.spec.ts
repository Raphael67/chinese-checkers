import { Test, TestingModule } from '@nestjs/testing';
import { PlayerCacheRepository } from './player-cache.repository';
import { PlayerService } from './player.service';

class PlayerCacheRepositoryMock extends PlayerCacheRepository { }

describe('PlayerService', () => {
    let service: PlayerService;
    const playerCacheRepository: PlayerCacheRepository = new PlayerCacheRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayerService,
                {
                    provide: PlayerCacheRepository,
                    useValue: playerCacheRepository,
                },
            ],
        }).compile();

        service = module.get<PlayerService>(PlayerService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });
});
