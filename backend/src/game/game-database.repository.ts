import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { Player } from '../player/player.class';
import { PlayerEntity } from '../player/player.entity';
import { Game } from './game.class';
import { GameEntity } from './game.entity';
import { Move } from './move.entity';

export interface IFinishedGamesWithPlayers {
    game_id: string;
    rounds: number;
    longest_streak: number;
    created_at: Date;
    nickname: string;
    position: number;
}

@EntityRepository(GameEntity)
export class DatabaseGameRepository extends Repository<GameEntity> {
    public static fromEntityToGame(gameEntity: GameEntity): Game {
        const game = new Game();
        game.id = gameEntity.id;
        game.creator = gameEntity.creator?.id;
        game.longestStreak = gameEntity.longestStreak;
        game.players = (gameEntity.gamePlayers || []).map((gamePlayer): Player => {
            const player = new Player();
            player.isBot = false;
            player.loses = gamePlayer.player.lose;
            player.nickname = gamePlayer.player.nickname;
            player.rating = gamePlayer.player.rating;
            player.wins = gamePlayer.player.win;
            return player;
        });
        game.moves = (gameEntity.moves || []).map((move) => {
            return move.path;
        });
        return game;
    }

    public async saveFinished(game: Game): Promise<GameEntity> {
        const gameEntity = new GameEntity();
        gameEntity.id = game.id;
        gameEntity.longestStreak = game.longestStreak;
        gameEntity.rounds = game.turn;
        gameEntity.status = game.status;

        gameEntity.moves = game.moves.map((move, index) => {
            const moveEntity = new Move();
            moveEntity.gameId = gameEntity.id;
            moveEntity.moveIndex = index;
            moveEntity.path = move;
            return moveEntity;
        });
        return await this.save(gameEntity);
    }

    @InjectRepository(PlayerEntity)
    private readonly playerRepository: Repository<PlayerEntity>;
}