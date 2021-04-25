import { Inject, Injectable, Logger } from '@nestjs/common';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/constants';
import { IGameEvents } from '../game/game-events.interface';
import { Game, GameStatus } from '../game/game.class';
import { GameService } from '../game/game.service';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { Board, Coords } from './board';
import { ConsoleService } from './console.service';

export interface IBoardService {
    isValidMove(game: Game, move: Coords[]): boolean;
}

@Injectable()
export class BoardService implements IBoardService {
    public constructor(
        @Inject(GameService)
        private readonly gameService: GameService,
        @Inject(GAME_SERVICE_EVENT_TOKEN)
        private readonly eventEmitter: IGameEvents,
        @Inject(PlayerService)
        private readonly playerService: PlayerService,
        @Inject(ConsoleService)
        private readonly consoleService: ConsoleService,
    ) { }

    public async playMove(game: Game, move: ICoords[]): Promise<void> {
        game.moves.push(move);
        if (move[0]) {
            game.board.getCell(move[0])?.setPawn(undefined);
            game.board.getCell(move[move.length - 1])?.setPawn(game.currentPlayer);
            this.updateLongestStreak(game, move.length - 1);
            const player = game.players[game.currentPlayer];
            if (move.length - 1 > player.longestStreak) {
                player.longestStreak = move.length - 1;
                await this.playerService.updatePLayer(player);
            }
        }
        await this.gameService.update(game.id, game);
        await this.consoleService.drawBoard(game.board);
        if (game.board.isWinner(game.currentPlayer)) {
            await this.gameService.endGame(game);
        } else {
            this.nextPlayer(game);
        }
    }

    private updateLongestStreak(game: Game, streak: number) {
        if (streak > game.longestStreak) {
            game.longestStreak = streak;
        }
    }

    public async startGame(game: Game): Promise<void> {
        for (let i = 0; i < 6; i++) {
            let player: Player | undefined = game.players[i];
            if (player) continue;
            player = new Player('AI');
            player.isBot = true;
            player.online = true;
            game.players[i] = player;
        }
        game.status = GameStatus.STARTED;
        await this.gameService.save(game);
        this.nextPlayer(game);
    }

    public nextPlayer(game: Game): void {
        game.currentPlayer = (game.currentPlayer + 1) % 6;
        if (game.currentPlayer === 0) game.turn++;
        this.logger.debug(`player ${game.currentPlayer}`);
        this.eventEmitter.emit('NEXT_PLAYER', game);
        this.eventEmitter.emit('GAME_STATE', game);
    }

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
