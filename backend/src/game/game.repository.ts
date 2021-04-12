import { EntityRepository, Repository } from 'typeorm';
import { Game } from './game.entity';

export interface IFinishedGamesWithPlayers {
    game_id: string;
    rounds: number;
    longest_streak: number;
    created_at: Date;
    nickname: string;
    position: number;
}

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
    public async findFinishedGamesWithPlayers(nickname?: string, date?: Date, orderBy: 'createdAt' | 'rounds' = 'createdAt'): Promise<Game[]> {
        const query = this.createQueryBuilder('game')
            .innerJoinAndSelect('game.gamePlayers', 'gamePlayers')
            .innerJoinAndSelect('gamePlayers.player', 'player');

        if (nickname) query.andWhere('player.nickname LIKE :nickname', { nickname: `${nickname}%` });
        if (date) query.andWhere('game.created_at BETWEEN :from AND :to', {
            from: new Date(date.setHours(0, 0, 0, 0)),
            to: new Date(date.setHours(23, 59, 59, 999)),
        });

        if (orderBy === 'createdAt') {
            query.orderBy('game.created_at', 'DESC');
        }
        if (orderBy === 'rounds') {
            query.orderBy('game.rounds', 'ASC');
        }

        return query.getMany();
    }
}