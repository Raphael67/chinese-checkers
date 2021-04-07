import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../player/player.entity';
import { GameDetailsDto } from './dto/game-details.dto';
import { GameMoves } from './game-moves.entity';
import { Color, GamePlayer } from './game-player.entity';
import { Game } from './game.entity';
import { GameRepository, IFinishedGamesWithPlayers } from './game.repository';

@Injectable()
export class GameService {
    @Inject(GameRepository) private readonly gameRepository: GameRepository;
    @InjectRepository(Player) private readonly playerRepository: Repository<Player>;
    @InjectRepository(GamePlayer) private readonly gamePlayerRepository: Repository<GamePlayer>;
    @InjectRepository(GameMoves) private readonly gameMovesRepository: Repository<GameMoves>;

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

    public async linkPlayerToGame(game: Game, player: Player, color: Color): Promise<Game> {
        const gamePlayer = new GamePlayer();
        gamePlayer.game = game;
        gamePlayer.player = player;
        gamePlayer.color = color;
        await this.gamePlayerRepository.save(gamePlayer);
        game.creator = player;
        return await this.gameRepository.save(game);
    }
}
