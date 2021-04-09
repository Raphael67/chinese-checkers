import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board';
import { Move } from './move.entity';
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
    describe('isValidPath', () => {
        it('should return false if no pawn at origin', () => {
            const board = new Board();
            const player = 0;
            const path = [[0, 0], [1, 1]];

            expect(service.isValidPath(board, player, path)).toBeFalsy();
        });
        it('should return false if pawn from anotehr player at origin', () => {
            const board = new Board();
            const player = 0;
            const path = [[6, 4], [8, 4]];

            expect(service.isValidPath(board, player, path)).toBeFalsy();
        });
        it('should return false if any cell not free', () => {
            const board = new Board();
            board.getCell(8, 4).setPawn(5);
            const player = 0;
            const path = [[9, 3], [8, 4]];

            expect(service.isValidPath(board, player, path)).toBeFalsy();
        });



        it('should return true for one cell move', () => {
            const board = new Board();
            const player = 0;
            const path = [[15, 3], [14, 4]];

            expect(service.isValidPath(board, player, path)).toBeTruthy();
        });
    });

});
