import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../game/game.entity';
import { Board, Cell } from './board';
import { Move } from './move.entity';

@Injectable()
export class MoveService {
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>;

    private boards: Map<string, Board> = new Map();

    public findByGame(game: Game): Promise<Move[]> {
        return this.moveRepository.find({
            where: {
                gameId: game.id,
            },
            order: {
                moveIndex: 'ASC',
            },
        });
    }

    private async loadBoard(game: Game): Promise<Board> {
        const board = new Board();
        const moves = await this.moveRepository.find({
            where: { gameId: game.id },
            order: { moveIndex: 'ASC' },
        });
        for (const move of moves) {
            await this.playPath(board, move.path);
        }
        this.boards.set(game.id, board);
        return board;
    }

    public async playPath(board: Board, path: Cell[]): Promise<void> {
        const from = board.getCell(path[0][0], path[0][1]);
        const to = board.getCell(path[path.length - 1][0], path[path.length - 1][1]);
        to.setPawn(from.getPawn());
        from.setPawn(undefined);
    }

    public isWinner(board: Board, player: number): boolean {
        return board.isWinner(player);
    }

    public nextPlayer(board: Board): void {
        board.nextPlayer();
    }

    public async saveMove(game: Game, path: Cell[]): Promise<Move> {
        const numberOfMove = await this.moveRepository.count({
            where: { gameId: game.id },
        });
        const move = new Move();
        move.gameId = game.id;
        move.moveIndex = numberOfMove;
        move.path = path;
        return this.moveRepository.save(move);
    }

    public async getBoard(game: Game): Promise<Board> {
        let board = this.boards.get(game.id);
        if (!board) {
            board = await this.loadBoard(game);
        }
        return board;
    }

    private isOneCellJump(from: Cell, to: Cell): boolean {
        if (Math.abs(to.x - from.x) <= 2 && Math.abs(to.y - from.y) <= 1) return true;
        return false;
    }

    private isJumpOver(board: Board, from: Cell, to: Cell): boolean {
        if (Math.abs(to.x - from.x) <= 4 && Math.abs(to.y - from.y) <= 2) {
            const between = board.getCell(from.x + (to.x - from.x) / 2, from.y + (to.y - from.y) / 2);
            if (between.getPawn()) return true;
        }
        return false;
    }

    public isValidPath(board: Board, player: number, path: Cell[]): boolean {
        // is player turn
        if (board.getCurrentPlayer() !== player) throw new Error(`Current player is ${board.getCurrentPlayer()}`);
        let moveIndex = 0;
        for (const move of path) {
            // Only valid cell in path
            if (!board.getCell(move[0], move[1])) {
                throw new Error(`Only valid cell in path: ${moveIndex}: ${move}`);
            }
            // first cell should contain a pawn from specified player
            if (moveIndex === 0 && board.getCell(move[0], move[1]).getPawn() !== player) {
                throw new Error(`first cell should contain a pawn from specified player: ${moveIndex}: ${move}`);
            }
            // Other cells should be free
            if (moveIndex > 0 && board.getCell(move[0], move[1]).getPawn() !== undefined) {
                throw new Error(`Other cells should be free: ${moveIndex}: ${move}`);
            }
            moveIndex++;
        }

        if (this.isOneCellJump(path[0], path[1])) {
            // One cell jump stop the path
            if (path.length !== 2) {
                throw new Error('One cell jump stop the path');
            }
        } else {
            for (let i = 0; i < path.length - 1; i++) {
                // Only multiple jump over allowed
                if (!this.isJumpOver(board, path[i], path[i + 1])) {
                    throw new Error('Only multiple jump over allowed');
                }
            }
        }
        return true;
    }

}
