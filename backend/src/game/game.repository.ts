import { EntityRepository, Repository } from 'typeorm';
import { Player } from '../player/player.entity';
import { Color, GamePlayer } from './game-player.entity';
import { Game, GameStatus } from './game.entity';

export interface IFinishedGamesWithPlayers {
    game_id: string;
    rounds: number;
    longest_streak: number;
    created_at: Date;
    nickname: string;
    color: Color;
}

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
    public findFinishedGamesWithPlayers(player?: string, date?: Date, orderBy: 'created_at' | 'rounds' = 'created_at'): Promise<IFinishedGamesWithPlayers[]> {
        const query = this.createQueryBuilder()
            .select([
                'game.id as game_id',
                'game.rounds as rounds',
                'game.longest_streak as longest_streak',
                'game.created_at as created_at',
                'player.nickname as nickname',
                'game_player.color as color',
            ])
            .innerJoin(GamePlayer, 'game_player', 'game.id = game_player.game_id')
            .innerJoin(Player, 'player', 'game_player.player_id = player.id')
            .where('game.status = :status', { status: GameStatus.TERMINATED })
            .orderBy(orderBy, 'DESC');

        if (player) {
            query.andWhere('player.nickname LIKE :nickname', { nickname: player + '%' });
        }
        if (date) {
            const begin = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));
            query.andWhere('game.created_at BETWEEN :begin AND :end', {
                begin: begin.toISOString(),
                end: end.toISOString()
            });
        }

        return query.execute();
    }
}