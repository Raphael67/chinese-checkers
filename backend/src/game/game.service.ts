import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Player } from '../player/player.class';
import { PlayerService } from '../player/player.service';
import { GameCacheRepository } from './game-cache.repository';
import { GameMongooseRepository } from './game-mongoose.repository';
import { Game, GameStatus } from './game.class';

@Injectable()
export class GameService {

    public constructor(
        @Inject(GameCacheRepository)
        private readonly gameCacheRepository: GameCacheRepository,
        @Inject(GameMongooseRepository)
        private readonly gameMongooseRepository: GameMongooseRepository,
        @Inject(PlayerService)
        private readonly playerService: PlayerService,
    ) { }

    public async findFinishedGames(
        nickname?: string,
        date?: Date,
        orderBy: 'createdAt' | 'rounds' = 'createdAt'
    ): Promise<Game[]> {
        return this.gameMongooseRepository.find(nickname, date, orderBy);
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

    public async save(game: Game): Promise<void> {
        await this.gameMongooseRepository.save(game);
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

    public async update(gameId: string, game: Game): Promise<void> {
        await this.gameMongooseRepository.update(game.id, game);
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

}