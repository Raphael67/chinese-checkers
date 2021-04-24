import { BadRequestException, Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Coords } from '../board/board';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { GAME_SERVICE_EVENT_TOKEN } from './constants';
import { GameCacheRepository } from './game-cache.repository';
import { IGameEvents } from './game-events.interface';
import { GameMongooseRepository } from './game-mongoose.repository';
import { Game, GameStatus } from './game.class';

interface IGameService {
    createGame(): Promise<Game>;
    addPlayerToGame(game: Game, player: Player, position: number): void;
    startGame(game: Game): void;
    nextPlayer(game: Game): void;
    playMove(gmae: Game, move: ICoords[]): void;
}

@Injectable()
export class GameService implements IGameService, OnModuleInit {

    public constructor(
        @Inject(GameCacheRepository)
        private readonly gameCacheRepository: GameCacheRepository,
        @Inject(GameMongooseRepository)
        private readonly gameMongooseRepository: GameMongooseRepository,
        @Inject(PlayerService)
        private readonly playerService: PlayerService,
        @Inject(GAME_SERVICE_EVENT_TOKEN)
        private readonly eventEmitter: IGameEvents,
    ) {

    }

    public onModuleInit(): void {
        this.eventEmitter.on('MOVE', (game: Game, move: Coords[]) => {
            this.playMove(game, move)
                .catch((err) => {
                    this.logger.error(err);
                });
        });
    }

    public async findFinishedGames(): Promise<Game[]> {
        return this.gameMongooseRepository.find();
    }

    public async loadGame(gameId: string): Promise<Game> {
        let game = await this.gameCacheRepository.findOne(gameId);
        if (!game) {
            game = await this.gameMongooseRepository.findOne(gameId);
            if (!game) throw new NotFoundException(`No game found with id: ${gameId}`);
            if (game.status !== GameStatus.FINISHED) {
                for (let i = 0; i < 6; i++) {
                    if (!game.players[i]) game.players[i] = this.playerService.generateBot();
                }
                await this.gameCacheRepository.save(game);
            }
        }
        return game;
    }

    public async createGame(): Promise<Game> {
        const game = new Game();
        await this.gameCacheRepository.save(game);
        return game;
    }

    public async addPlayerToGame(game: Game, player: Player, position: number): Promise<void> {
        if (game.status !== GameStatus.CREATED) throw new BadRequestException(`Game can not be start as it is in status: ${game.status}`);
        if (!this.isPositionAvailable(game, position)) throw new BadRequestException('Position not available');
        if (!this.isNicknameAvailable(game, player.nickname)) throw new BadRequestException('Nickname already taken');
        if (!game.creator) game.creator = player.nickname;
        game.players[position] = player;
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
        await this.gameMongooseRepository.save(game);
        this.nextPlayer(game);
    }

    public joinGame(game: Game, nickname: string): void {
        const player = game.players.find((player) => player.nickname === nickname);
        if (!player) throw new NotFoundException(`Player ${nickname} not present in this game`);
        player.online = true;
    }

    public disconnectPlayer(game: Game, nickname: string): void {
        const player = game.players.find((player) => player.nickname === nickname);
        if (!player) throw new NotFoundException(`Player ${nickname} not present in this game`);
        player.online = false;
    }

    public nextPlayer(game: Game): void {
        game.currentPlayer = (game.currentPlayer + 1) % 6;
        if (game.currentPlayer === 0) game.turn++;
        this.logger.debug(`player ${game.currentPlayer}`);
        this.eventEmitter.emit('NEXT_PLAYER', game);
        this.eventEmitter.emit('GAME_STATE', game);
    }

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
        await this.gameMongooseRepository.update(game.id, game);
        if (game.board.isWinner(game.currentPlayer)) {
            await this.endGame(game);
        } else {
            this.nextPlayer(game);
        }
    }

    public async endGame(game: Game): Promise<Game> {
        game.status = GameStatus.FINISHED;
        game.winner = game.players[game.currentPlayer]?.nickname;
        const playerEntities = [];
        for (let i = 0; i < 6; i++) {
            const player = game.players[i];
            if (player.isBot) continue;
            if (game.winner === player.nickname) {
                player.wins++;
            } else {
                player.loses++;
            }
            await this.playerService.updatePLayer(player);
            playerEntities[i] = player;
        }
        await this.gameMongooseRepository.update(game.id, game);
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
        if (game.players.find((player) => player && player.nickname === nickname)) {
            return false;
        }
        return true;
    }

    private updateLongestStreak(game: Game, streak: number) {
        if (streak > game.longestStreak) {
            game.longestStreak = streak;
        }
    }
}