import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cell, Coords, playerPositions } from '../board/board';
import { IGameEvents } from '../game/game-events.interface';
import { Game } from '../game/game.class';
import { GAME_SERVICE_EVENT_TOKEN } from '../game/game.module';

interface Scoring {
    id: string;
    currentDistance: number;
    bestDistance: number;
    score: number;
    path: Cell[];
}

@Injectable()
export class BotService {
    private readonly logger: Logger = new Logger(BotService.name);

    public constructor(
        @Inject(GAME_SERVICE_EVENT_TOKEN)
        private readonly eventEmitter: IGameEvents
    ) {
        this.eventEmitter.on('NEXT_PLAYER', (game: Game) => {
            if (game.players[game.currentPlayer].isBot) {
                const move = this.play(game);
                this.eventEmitter.emit('MOVE', game, move);
            }
        });
    }

    public play(game: Game): Coords[] {
        this.logger.debug('Bot is playing');
        const scorings: Scoring[] = [];
        const target = this.findTarget(game);
        const playerPawns = game.board.getCells().filter((cell) => cell.getPawn() === game.currentPlayer);
        playerPawns.forEach((cell) => {
            const currentDistance = Coords.dist(cell.coords, target.coords);
            const bestPath = this.findPath(game, cell, target);
            scorings.push({
                id: cell.getIndex(),
                currentDistance: currentDistance,
                bestDistance: bestPath.distance,
                path: bestPath.path,
                score: currentDistance - bestPath.distance,
            });
        });
        scorings.sort((a, b) => {
            return b.score - a.score;
        });
        return scorings[0].path.map((cell) => cell.coords);
    }

    private findTarget(game: Game): Cell {
        return game.board.getCells().find(cell => {
            return playerPositions[(game.currentPlayer + 3) % 6].includes(cell.getIndex()) && (cell.getPawn() === undefined || cell.getPawn() !== game.currentPlayer);
        });
    }

    private findPath(game: Game, start: Cell, target: Cell): { distance: number, path: Cell[]; } {
        const dist: Map<number, Cell[]> = new Map();
        const recursive = (path: Cell[]) => {
            const availableMoves = this.getMoves(game, path[path.length - 1], path.length === 1);
            availableMoves.forEach((hasJump, cell) => {
                if (path.includes(cell)) return;
                const newPath = path.concat(cell);
                if (!hasJump) {
                    dist.set(Coords.dist(target.coords, cell.coords), newPath);
                } else {
                    dist.set(Coords.dist(target.coords, cell.coords), newPath);
                    recursive(newPath);
                }
            });
        };
        recursive([start]);
        let bestDist = Infinity;
        let bestPath: Cell[] = [];
        dist.forEach((path, dist) => {
            if (dist < bestDist) {
                bestPath = path;
                bestDist = dist;
            }
        });
        return {
            distance: bestDist,
            path: bestPath,
        };
    }

    private getMoves(game: Game, from: Cell, allowNoJump: boolean = true) {
        const moves: Map<Cell, boolean> = new Map();
        game.board.getCells().forEach((to) => {
            if (to.getPawn() !== undefined) return;
            if (allowNoJump && Math.abs(to.coords.y - from.coords.y) <= 1 && Math.abs(to.coords.x - from.coords.x) <= 2) moves.set(to, false);
            if (Math.abs(to.coords.y - from.coords.y) <= 2 && Math.abs(to.coords.x - from.coords.x) <= 4) {
                const between = game.board.getCells().find((c) => {
                    return c.getPawn()
                        && c.coords.y === (from.coords.y + (to.coords.y - from.coords.y) / 2)
                        && c.coords.x === (from.coords.x + (to.coords.x - from.coords.x) / 2);
                });
                if (between) {
                    moves.set(to, true);
                }
            }
        });
        return moves;
    }


}