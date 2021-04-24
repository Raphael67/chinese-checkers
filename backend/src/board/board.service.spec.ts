import { Test, TestingModule } from '@nestjs/testing';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/constants';
import { Game } from '../game/game.class';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { Coords } from './board';
import { BoardService } from './board.service';

describe('BoardService', () => {
    let service: BoardService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: GameService,
                    useValue: {},
                },
                {
                    provide: GAME_SERVICE_EVENT_TOKEN,
                    useValue: {},
                },
                {
                    provide: PlayerService,
                    useValue: {},
                },
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
            game.board.getCell(new Coords(8, 4))!.setPawn(5);
            const path = [new Coords(9, 3), new Coords(8, 4)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });
        it('should return false for two step forward', () => {
            const game = new Game();
            const path = [new Coords(11, 3), new Coords(12, 4), new Coords(13, 5)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });
        it('should return false for one step and a jump', () => {
            const game = new Game();
            const path = [new Coords(11, 3), new Coords(12, 4), new Coords(14, 6)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });
        it('should return false for a jump and one step', () => {
            const game = new Game();
            const path = [new Coords(10, 2), new Coords(12, 4), new Coords(13, 5)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });
        it('should return false for one jump over nothing', () => {
            const game = new Game();
            const path = [new Coords(11, 3), new Coords(13, 5)];

            expect(() => service.isValidMove(game, path)).toThrow();
        });
        it('should return true for one cell move', () => {
            const game = new Game();
            const path = [new Coords(15, 3), new Coords(14, 4)];

            expect(() => service.isValidMove(game, path)).toBeTruthy();
        });
        it('should return true for one jump over a pawn', () => {
            const game = new Game();
            const path = [new Coords(10, 2), new Coords(12, 4)];

            expect(() => service.isValidMove(game, path)).toBeTruthy();
        });
    });

});
