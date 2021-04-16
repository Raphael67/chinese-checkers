import { EntityRepository, Repository } from 'typeorm';
import { Player } from './player.class';
import { PlayerEntity } from './player.entity';

@EntityRepository(PlayerEntity)
export class PlayerRepository extends Repository<PlayerEntity> {
    public static fromEntityToPlayer(playerEntity: PlayerEntity): Player {
        const player = new Player();
        player.id = playerEntity.id;
        player.loses = playerEntity.lose;
        player.nickname = playerEntity.nickname;
        player.rating = playerEntity.rating;
        player.wins = playerEntity.win;
        return player;
    }

    public static fromPlayerToEntity(player: Player): PlayerEntity {
        const playerEntity = new PlayerEntity(player.nickname);
        playerEntity.id = player.id;
        playerEntity.lose = player.loses;
        playerEntity.win = player.wins;
        return playerEntity;
    }
}