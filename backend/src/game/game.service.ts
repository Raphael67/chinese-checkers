import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Move } from '../play/move.entity';
import { Player } from '../player/player.entity';
import { GameDetailsDto } from './dto/game-details.dto';
import { Color, GamePlayer } from './game-player.entity';
import { Game, GameStatus } from './game.entity';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
    @Inject(GameRepository) private readonly gameRepository: GameRepository;
    @InjectRepository(Player) private readonly playerRepository: Repository<Player>;
    @InjectRepository(GamePlayer) private readonly gamePlayerRepository: Repository<GamePlayer>;
    @InjectRepository(Move) private readonly gameMovesRepository: Repository<Move>;

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

    public async createGame() {
        const game = new Game();
        await this.gameRepository.save(game);
        return game;
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
    }

    public isColorAvailable(game: Game, color: Color): boolean {
        if (game.gamePlayers.find((gamePlayer) => gamePlayer.color === color)) {
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

    public async linkPlayerToGame(game: Game, player: Player, color: Color): Promise<Game> {
        if (game.status !== GameStatus.CREATED) throw new BadRequestException('Game can not be started due to its current state: ' + game.status);
        const gamePlayer = new GamePlayer();
        gamePlayer.gameId = game.id;
        gamePlayer.player = player;
        gamePlayer.color = color;
        await this.gamePlayerRepository.save(gamePlayer);
        game.gamePlayers.push(gamePlayer);
        if (game.gamePlayers.length === 0) {
            game.creator = player;
            await this.gameRepository.update({ id: game.id }, { creator: player });
        }
        return game;
    }

    private async fillGameWithBots(game: Game): Promise<void> {
        const colors: Color[] = [Color.BLACK, Color.BLUE, Color.GREEN, Color.PURPLE, Color.RED, Color.YELLOW];
        for (const color of colors) {
            if (!game.gamePlayers.find((gamePlayer: GamePlayer) => {
                return gamePlayer.color === color;
            })) {
                const player = await this.playerRepository.findOne({
                    where: { nickname: `${color}_AI` },
                });
                await this.linkPlayerToGame(game, player, color);
            }
        }
    }
}
