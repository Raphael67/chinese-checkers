import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/player.entity';
import { GameDetailsDto } from './dto/game-details.dto';
import { Color, GamePlayer } from './game-player.entity';
import { Game } from './game.entity';
import { GameRepository, IFinishedGamesWithPlayers } from './game.repository';
import { Move } from './move.entity';

@Injectable()
export class GameService {
    @Inject(GameRepository) private readonly gameRepository: GameRepository;
    @InjectRepository(Player) private readonly playerRepository: Repository<Player>;
    @InjectRepository(GamePlayer) private readonly gamePlayerRepository: Repository<GamePlayer>;
    @InjectRepository(Move) private readonly gameMovesRepository: Repository<Move>;

    public async listGames(
        player?: string,
        date?: Date,
        orderBy?: 'created_at' | 'rounds'
    ): Promise<GameDetailsDto[]> {
        const gameDetails = await this.gameRepository.findFinishedGamesWithPlayers(player, date, orderBy);
        const gameMap = gameDetails.reduce((previous: Map<string, GameDetailsDto>, current: IFinishedGamesWithPlayers) => {
            let entry = previous.get(current.game_id);
            if (!entry) {
                entry = new GameDetailsDto();
                entry.created_at = current.created_at;
                entry.game_id = current.game_id;
                entry.longest_streak = current.longest_streak;
                entry.rounds = current.rounds;
                previous.set(current.game_id, entry);
            }
            entry.players.push({
                color: current.color,
                nickname: current.nickname,
            });
            return previous;
        }, new Map());
        return [...gameMap].map(([key, value]) => value);
    }

    public async createGame() {
        const game = new Game();
        await this.gameRepository.save(game);
        return game;
    }

    public findOne(gameId: string): Promise<Game> {
        return this.gameRepository.findOne(gameId, {
            relations: ['gamePlayers', 'players'],
        });
    }

    public isColorAvailable(game: Game, color: Color): boolean {
        if (game.gamePlayers.find((gamePlayer) => gamePlayer.color === color)) {
            return false;
        }
        return true;
    }

    public isNicknameAvailable(game: Game, nickname: string): boolean {
        if (game.players.find((p) => p.nickname === nickname)) {
            return false;
        }
        return true;
    }

    public async linkPlayerToGame(game: Game, player: Player, color: Color): Promise<Game> {
        const gamePlayer = new GamePlayer();
        gamePlayer.gameId = game.id;
        gamePlayer.player = player;
        gamePlayer.color = color;
        game.gamePlayers.push(gamePlayer);
        game.creator = player;
        return await this.gameRepository.save(game);
    }
}
