import { EntityRepository, Repository } from 'typeorm';
import { Player } from '../player/player.class';
import { Game } from './game.class';
import { GameEntity } from './game.entity';

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
        return game;
    }


}