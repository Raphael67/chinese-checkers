import { Injectable, Logger } from '@nestjs/common';
import { Game } from '../game/game.class';
import { Board, Coords } from './board';

export interface IBoardService {
    isValidMove(game: Game, move: Coords[]): boolean;
}

@Injectable()
export class BoardService implements IBoardService {
    public isValidMove(game: Game, move: Coords[]): boolean {
        let moveIndex = 0;
        for (const coords of move) {
            // Only valid cell in path
            if (!game.board.getCell(coords)) {
                this.logger.warn(`Player tried to move on invalid cell: ${JSON.stringify(coords)}`);
                throw new Error(`Only valid cell in path: ${moveIndex}: ${JSON.stringify(coords)}`);
            }
            // first cell should contain a pawn from current player
            if (moveIndex === 0 && game.board.getCell(coords)?.getPawn() !== game.currentPlayer) {
                this.logger.warn(`Player tried to move from another pawn at: ${JSON.stringify(coords)}`);
                throw new Error(`first cell should contain a pawn from specified player: ${moveIndex}: ${JSON.stringify(coords)}`);
            }
            // Other cells should be free
            if (moveIndex > 0 && game.board.getCell(coords)?.getPawn() !== undefined) {
                this.logger.warn(`Player tried to move on a not empty cell: ${JSON.stringify(coords)}`);
                throw new Error(`Other cells should be free: ${moveIndex}: ${JSON.stringify(coords)}`);
            }
            moveIndex++;
        }

        if (this.isOneCellJump(move[0], move[1])) {
            // One cell jump stop the path
            if (move.length !== 2) {
                throw new Error('One cell jump stop the path');
            }
        } else {
            for (let i = 0; i < move.length - 1; i++) {
                // Only multiple jump over allowed
                if (!this.isJumpOver(game.board, move[i], move[i + 1])) {
                    throw new Error('Only multiple jump over allowed');
                }
            }
        }
        return true;
    }

    private readonly logger: Logger = new Logger(BoardService.name);

    private isOneCellJump(from: Coords, to: Coords): boolean {
        if (Math.abs(to.x - from.x) <= 2 && Math.abs(to.y - from.y) <= 1) return true;
        return false;
    }

    private isJumpOver(board: Board, from: Coords, to: Coords): boolean {
        if (Math.abs(to.x - from.x) <= 4 && Math.abs(to.y - from.y) <= 2) {
            const between = board.getCell(new Coords(from.x + (to.x - from.x) / 2, from.y + (to.y - from.y) / 2));
            if (between?.getPawn() !== undefined) return true;
        }
        return false;
    }
}