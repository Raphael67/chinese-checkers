import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/player.entity';
import { GameDetailsDto } from './dto/game-details.dto';
import { GamePlayer } from './game-player.entity';
import { Game, GameStatus } from './game.entity';
import { GameRepository } from './game.repository';
import { MoveService } from './move.service';

@Injectable()
export class GameService {
    @Inject(GameRepository) private readonly gameRepository: GameRepository;
    @InjectRepository(Player) private readonly playerRepository: Repository<Player>;
    @InjectRepository(GamePlayer) private readonly gamePlayerRepository: Repository<GamePlayer>;
    @Inject(MoveService) private readonly moveService: MoveService;

    public async listGames(
        player?: string,
        date?: Date,
        orderBy?: 'createdAt' | 'rounds'
    ): Promise<GameDetailsDto[]> {
        const games = await this.gameRepository.findFinishedGamesWithPlayers(player, date, orderBy);
        const gameDetailsDtos = games.map((game): GameDetailsDto => {
            return new GameDetailsDto(game);
        });
        return gameDetailsDtos;
    }

    public async createGame(): Promise<Game> {
        const game = new Game();
        await this.gameRepository.save(game);
        return game;
    }

    public getLoadedGame(gameId: string): Game | undefined {
        return this.games.get(gameId);
    }

    public async findOne(gameId: string): Promise<Game> {
        return await this.gameRepository.findOne(gameId, {
            relations: ['gamePlayers', 'gamePlayers.player'],
        });
    }

    public async start(game: Game): Promise<void> {
        if (game.status !== GameStatus.CREATED) throw new BadRequestException('Game can not be started due to its current state: ' + game.status);
        await this.fillGameWithBots(game);
        game.status = GameStatus.IN_PROGRESS;
        await this.gameRepository.update({ id: game.id }, { status: game.status });
        this.games.set(game.id, game);
    }

    public isPositionAvailable(game: Game, position: number): boolean {
        if (game.gamePlayers.find((gamePlayer) => gamePlayer.position === position)) {
            return false;
        }
        return true;
    }

    public isNicknameAvailable(game: Game, nickname: string): boolean {
        if (game.gamePlayers.find((gamePlayer) => gamePlayer.player.nickname === nickname)) {
            return false;
        }
        return true;
    }

    public async linkPlayerToGame(game: Game, player: Player, position: number): Promise<Game> {
        if (game.status !== GameStatus.CREATED) throw new BadRequestException('Game can not be started due to its current state: ' + game.status);
        const gamePlayer = new GamePlayer();
        gamePlayer.gameId = game.id;
        gamePlayer.player = player;
        gamePlayer.position = position;
        await this.gamePlayerRepository.save(gamePlayer);
        game.gamePlayers.push(gamePlayer);
        if (game.gamePlayers.length === 0) {
            game.creator = player;
            await this.gameRepository.update({ id: game.id }, { creator: player });
        }
        return game;
    }

    public async setWinner(game: Game, player: Player): Promise<void> {
        game.winner = player;
        game.status = GameStatus.TERMINATED;
        await this.gameRepository.update({ id: game.id }, { ...game });
    }

    /**
     * Games currently played
     */
    private games: Map<string, Game> = new Map();

    private async fillGameWithBots(game: Game): Promise<void> {
        for (let i = 0; i < 6; i++) {
            if (!game.gamePlayers.find((gamePlayer: GamePlayer) => {
                return gamePlayer.position === i;
            })) {
                const player = await this.playerRepository.findOne({
                    where: { nickname: `${i}_AI` },
                });
                await this.linkPlayerToGame(game, player, i);
            }
        }
    }
}
