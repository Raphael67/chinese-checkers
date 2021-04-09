import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../game/game.entity';
import { Board } from './board';
import { Move } from './move.entity';

@Injectable()
export class MoveService {
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>;

    private boards: Map<string, Board> = new Map();

    public findByGame(game: Game): Promise<Move[]> {
        return this.moveRepository.find({
            where: {
                gameId: game.id
            },
            order: {
                moveIndex: 'ASC'
            }
        });
    }

    private async loadBoard(game: Game): Promise<Board> {
        const board = new Board();
        const moves = await this.moveRepository.find({
            where: { gameId: game.id },
            order: { moveIndex: 'ASC' }
        });
        moves.forEach((move) => {
            const from = board.getCell(move.path[0][0], move.path[0][1]);
            const to = board.getCell(move.path[move.path.length - 1][0], move.path[move.path.length - 1][1]);
            to.setPawn(from.getPawn());
            from.setPawn(undefined);
        });
        this.boards.set(game.id, board);
        return board;
    }

    public async getBoard(game: Game): Promise<Board> {
        let board = this.boards.get(game.id);
        if (!board) {
            board = await this.loadBoard(game);
        }
        return board;
    }

    private isOneCellJump(from: number[], to: number[]): boolean {
        if (Math.abs(to[0] - from[0]) <= 2 && Math.abs(to[1] - from[1]) <= 1) return true;
        return false;
    }

    private isJumpOver(board: Board, from: number[], to: number[]): boolean {
        if (Math.abs(to[0] - from[0]) <= 4 && Math.abs(to[1] - from[1]) <= 2) {
            const between = board.getCell(from[0] + (to[0] - from[0]) / 2, from[1] + (to[1] - from[1]) / 2);
            if (between.getPawn()) return true;
        }
        return false;
    }

    public isValidPath(board: Board, player: number, path: number[][]): boolean {
        let moveIndex = 0;
        for (let move of path) {
            // Only valid cell in path
            if (!board.getCell(move[0], move[1])) return false;
            // first cell should contain a pawn from specified player
            if (moveIndex === 0 && board.getCell(move[0], move[1]).getPawn() !== player) return false;
            // Other cells should be free
            if (moveIndex > 0 && board.getCell(move[0], move[1]).getPawn() !== undefined) return false;
            moveIndex++;
        }

        if (this.isOneCellJump(path[0], path[1])) {
            if (path.length !== 2) return false;
        } else {
            for (let i = 0; i < path.length - 1; i++) {
                if (!this.isJumpOver(board, path[i], path[i + 1])) {
                    return false;
                }
            }
        }
        return true;
    }

}
