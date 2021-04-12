import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board, Cell } from './board';
import { Game } from './game.entity';
import { Move } from './move.entity';

@Injectable()
export class MoveService {
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>;

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

    private async updateBoard(game: Game): Promise<void> {
        const moves = await this.moveRepository.find({
            where: { gameId: game.id },
            order: { moveIndex: 'ASC' },
        });
        for (const move of moves) {
            await this.playPath(game, move.path);
        }
    }

    public async playPath(game: Game, path: Cell[]): Promise<void> {
        const from = game.board.getCell(path[0][0], path[0][1]);
        const to = game.board.getCell(path[path.length - 1][0], path[path.length - 1][1]);
        to.setPawn(from.getPawn());
        from.setPawn(undefined);
    }

    public isWinner(board: Board, player: number): boolean {
        return board.isWinner(player);
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

    public isValidPath(game: Game, player: number, path: Cell[]): boolean {
        // is player turn
        if (game.currentPlayer !== player) throw new Error(`Current player is ${game.currentPlayer}`);
        let moveIndex = 0;
        for (const move of path) {
            // Only valid cell in path
            if (!game.board.getCell(move[0], move[1])) {
                throw new Error(`Only valid cell in path: ${moveIndex}: ${move}`);
            }
            // first cell should contain a pawn from specified player
            if (moveIndex === 0 && game.board.getCell(move[0], move[1]).getPawn() !== player) {
                throw new Error(`first cell should contain a pawn from specified player: ${moveIndex}: ${move}`);
            }
            // Other cells should be free
            if (moveIndex > 0 && game.board.getCell(move[0], move[1]).getPawn() !== undefined) {
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
                if (!this.isJumpOver(game.board, path[i], path[i + 1])) {
                    throw new Error('Only multiple jump over allowed');
                }
            }
        }
        return true;
    }

}
