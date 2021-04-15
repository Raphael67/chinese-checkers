import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Player } from './player.class';
import { PlayerEntity } from './player.entity';

@Injectable()
export class PlayerRepository extends Repository<PlayerEntity> {
    public static fromEntityToPlayer(playerEntity: PlayerEntity): Player {
        const player = new Player();
        player.loses = playerEntity.lose;
        player.nickname = playerEntity.nickname;
        player.rating = playerEntity.rating;
        player.wins = playerEntity.win;
        return player;
    }
}