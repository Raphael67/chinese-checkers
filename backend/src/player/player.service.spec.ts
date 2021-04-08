import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { PlayerService } from './player.service';

class PlayerRepositoryMock extends Repository<Player> { };

describe('PlayerService', () => {
    let service: PlayerService;
    let playerRepository: Repository<Player> = new PlayerRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayerService,
                {
                    provide: getRepositoryToken(Player),
                    useValue: playerRepository,
                },
            ],
        }).compile();

        service = module.get<PlayerService>(PlayerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});