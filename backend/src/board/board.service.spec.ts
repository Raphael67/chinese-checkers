import { Test, TestingModule } from '@nestjs/testing';
import { Game } from '../game/game.entity';
import { Coords } from './board';
import { BoardService } from './board.service';

describe('BoardService', () => {
    let service: BoardService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BoardService,
            ],
        }).compile();

        service = module.get<BoardService>(BoardService);
    });
    describe('isValidMove', () => {
        it('should return false if no pawn at origin', () => {
            const game = new Game();
            const path = [new Coords(0, 0), new Coords(1, 1)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });
        it('should return false if pawn from anotehr player at origin', () => {
            const game = new Game();
            const path = [new Coords(6, 4), new Coords(8, 4)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });
        it('should return false if any cell not free', () => {
            const game = new Game();
            game.board.getCell(new Coords(8, 4)).setPawn(5);
            const path = [new Coords(9, 3), new Coords(8, 4)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });

        it('should return true for one cell move', () => {
            const game = new Game();
            const path = [new Coords(15, 3), new Coords(14, 4)];

            expect(() => service.isValidMove(game, path)).toBeTruthy();
        });
    });

});
