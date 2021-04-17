import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Player } from '../player/player.entity';
import { PlayerService } from '../player/player.service';
import { Coords } from './board';
import { CacheGameRepository } from './game-cache.repository';
import { Game, GameStatus } from './game.entity';
import { GAME_SERVICE_EVENT_TOKEN } from './game.module';

interface IGameService {
    createGame(): Promise<Game>;
    addPlayerToGame(game: Game, player: Player, position: number): void;
    startGame(game: Game): void;
    nextPlayer(game: Game): void;
    playMove(gmae: Game, move: ICoords[]): void;
}

@Injectable()
export class GameService implements IGameService {

    public constructor(
        @Inject(CacheGameRepository)
        private readonly cacheGameRepository: CacheGameRepository,

        @Inject(PlayerService)
        private readonly playerService: PlayerService,

        @Inject(GAME_SERVICE_EVENT_TOKEN)
        private readonly eventEmitter: EventEmitter,
    ) {
        this.eventEmitter.on('MOVE', (game: Game, move: Coords[]) => {
            this.playMove(game, move)
                .catch((err) => {
                    this.logger.error(err);
                });
        });
    }

    public async loadGame(gameId: string): Promise<Game> {
        const game = this.cacheGameRepository.findOne(gameId);
        if (!game) {
            if (!game) throw new NotFoundException(`No game found with id: ${gameId}`);
        }
        return game;
    }

    public async createGame(): Promise<Game> {
        const game = new Game();
        this.cacheGameRepository.save(game);
        return game;
    }

    public addPlayerToGame(game: Game, player: Player, position: number): void {
        if (!this.isPositionAvailable(game, position)) throw new BadRequestException('Position not available');
        if (!this.isNicknameAvailable(game, player.nickname)) throw new BadRequestException('Nickname already taken');
        if (!game.creator) game.creator = player.nickname;
        game.players[position] = player;
        this.cacheGameRepository.update(game.id, game);
    }

    public startGame(game: Game): void {
        for (let i = 0; i < 6; i++) {
            let player: any = game.players[i];
            if (!player) {
                player = new Player('AI');
                player.isBot = true;
                player.online = true;
                game.players[i] = player;
            }
        }
        game.status = GameStatus.STARTED;
        this.nextPlayer(game);
    }

    public nextPlayer(game: Game): void {
        this.logger.debug(`${game.id}: Next player`);
        game.currentPlayer = (game.currentPlayer + 1) % 6;
        this.eventEmitter.emit('NEXT_PLAYER', game);
    }

    public async playMove(game: Game, move: ICoords[]): Promise<void> {
        game.moves.push(move);
        if (move[0]) {
            game.board.getCell(move[0]).setPawn(undefined);
            game.board.getCell(move[move.length - 1]).setPawn(game.currentPlayer);
        }
        if (game.board.isWinner(game.currentPlayer)) {
            await this.endGame(game);
        } else {
            this.nextPlayer(game);
        }
    }

    public async endGame(game: Game): Promise<Game> {
        game.status = GameStatus.FINISHED;
        game.winner = game.players[game.currentPlayer].nickname;
        const playerEntities = [];
        for (let i = 0; i < 6; i++) {
            const player: Player = game.players[i];
            if (player.isBot) continue;
            if (game.winner === player.nickname) {
                player.wins++;
            } else {
                player.loses++;
            }
            await this.playerService.updatePLayer(player);
            playerEntities[i] = player;
        }
        this.cacheGameRepository.save(game);
        return game;
    }



    private readonly logger: Logger = new Logger(GameService.name);

    private isPositionAvailable(game: Game, position: number): boolean {
        if (game.players[position]) {
            return false;
        }
        return true;
    }

    private isNicknameAvailable(game: Game, nickname: string): boolean {
        if (game.players.find((player) => player.nickname === nickname)) {
            return false;
        }
        return true;
    }
}