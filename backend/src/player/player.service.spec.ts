import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';
import { PlayerService } from './player.service';

class PlayerRepositoryMock extends Repository<PlayerEntity> { }

describe('PlayerService', () => {
    let service: PlayerService;
    const playerRepository: Repository<PlayerEntity> = new PlayerRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayerService,
                {
                    provide: getRepositoryToken(PlayerEntity),
                    useValue: playerRepository,
                },
            ],
        }).compile();

        service = module.get<PlayerService>(PlayerService);
    });

    describe('createPlayer', () => {
        it('should throw if nickkname reserved', async () => {
            const nickname = 'BLACK_AI';

            await expect(() => service.createPlayer(nickname)).rejects.toThrow();
        });
    });
});
