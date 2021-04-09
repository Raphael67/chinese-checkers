import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Move } from '../game/move.entity';
import { MoveService } from './move.service';

class MoveRepositoryMock extends Repository<Move> { }


describe('MoveService', () => {
    let service: MoveService;
    let moveRepository: Repository<Move> = new MoveRepositoryMock();


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MoveService,
                {
                    provide: getRepositoryToken(Move),
                    useValue: moveRepository
                }
            ],
        }).compile();

        service = module.get<MoveService>(MoveService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
