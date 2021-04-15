import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cell } from './board';
import { BoardService } from './board.service';
import { GameEntity } from './game.entity';
import { Move } from './move.entity';

class MoveRepositoryMock extends Repository<Move> { }


describe('BoardService', () => {
    let service: BoardService;
    const moveRepository: Repository<Move> = new MoveRepositoryMock();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BoardService,
                {
                    provide: getRepositoryToken(Move),
                    useValue: moveRepository,
                },
            ],
        }).compile();

        service = module.get<BoardService>(BoardService);
    });
    describe('isValidPath', () => {
        it('should return false if no pawn at origin', () => {
            const game = new GameEntity();
            const player = 0;
            const path = [new Cell(0, 0), new Cell(1, 1)];

            expect(() => service.isValidPath(game, player, path)).toThrow();
        });
        it('should return false if pawn from anotehr player at origin', () => {
            const game = new GameEntity();
            const player = 0;
            const path = [new Cell(6, 4), new Cell(8, 4)];

            expect(() => service.isValidPath(game, player, path)).toThrow();
        });
        it('should return false if any cell not free', () => {
            const game = new GameEntity();
            game.board.getCell(8, 4).setPawn(5);
            const player = 0;
            const path = [new Cell(9, 3), new Cell(8, 4)];

            expect(() => service.isValidPath(game, player, path)).toThrow();
        });

        it('should return true for one cell move', () => {
            const game = new GameEntity();
            const player = 0;
            const path = [new Cell(15, 3), new Cell(14, 4)];

            expect(() => service.isValidPath(game, player, path)).toBeTruthy();
        });
    });

});
