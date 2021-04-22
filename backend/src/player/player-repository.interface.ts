import { Player } from './player.class';

export interface IPlayerRepository {
    findOneByNickname(nickname: string): Promise<Player | undefined>;
    findByRating(): Promise<Player[]>;
    save(player: Player): Promise<void>;
    update(playerId: string, playerData: Partial<Player>): Promise<Player>;

}