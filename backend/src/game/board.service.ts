import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIService } from './ai.service';
import { Board, Coords } from './board';
import { CacheGameRepository } from './game-cache.repository';
import { Game } from './game.class';
import { GameEntity } from './game.entity';
import { Move } from './move.entity';

export interface IBoardService {
    isWinner(board: Board, player: number): boolean;
    playMove(board: number[][], move: Coords[]): void;
    isValidMove(game: Game, move: Coords[]): boolean;
}

@Injectable()
export class BoardService implements IBoardService {

    public playMove(board: number[][], move: Coords[]): void {
        throw new Error('not implemented');
    }

    public isValidMove(game: Game, move: Coords[]): boolean {
        let moveIndex = 0;
        for (const coords of move) {
            // Only valid cell in path
            if (!game.board.getCell(coords)) {
                throw new Error(`Only valid cell in path: ${moveIndex}: ${coords}`);
            }
            // first cell should contain a pawn from current player
            if (moveIndex === 0 && game.board.getCell(coords).getPawn() !== game.getCurrentPlayer()) {
                throw new Error(`first cell should contain a pawn from specified player: ${moveIndex}: ${coords}`);
            }
            // Other cells should be free
            if (moveIndex > 0 && game.board.getCell(coords).getPawn() !== undefined) {
                throw new Error(`Other cells should be free: ${moveIndex}: ${coords}`);
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

    public isWinner(board: Board, player: number): boolean {
        return board.isWinner(player);
    }

    public async saveMove(game: GameEntity, path: Coords[]): Promise<Move> {
        const numberOfMove = await this.moveRepository.count({
            where: { gameId: game.id },
        });
        const move = new Move();
        move.gameId = game.id;
        move.moveIndex = numberOfMove;
        move.path = path;
        return this.moveRepository.save(move);
    }

    private isOneCellJump(from: Coords, to: Coords): boolean {
        if (Math.abs(to.x - from.x) <= 2 && Math.abs(to.y - from.y) <= 1) return true;
        return false;
    }

    private isJumpOver(board: Board, from: Coords, to: Coords): boolean {
        if (Math.abs(to.x - from.x) <= 4 && Math.abs(to.y - from.y) <= 2) {
            const between = board.getCell(new Coords(from.x + (to.x - from.x) / 2, from.y + (to.y - from.y) / 2));
            if (between.getPawn()) return true;
        }
        return false;
    }

    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>;

    @Inject(CacheGameRepository)
    private readonly gameRepository: CacheGameRepository;

    @Inject(AIService)
    private readonly aiService: AIService;
}
