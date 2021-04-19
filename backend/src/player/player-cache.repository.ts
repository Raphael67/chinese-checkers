import { Injectable } from '@nestjs/common';
import { Player } from './player.class';

@Injectable()
export class PlayerCacheRepository {

    public find(): Player[] {
        const players = [];
        this.playerMap.forEach(player => players.push(player));
        return players;
    }

    public findOneById(playerId: string): Player {
        return this.playerMap.get(playerId);
    }

    public findOneByNickname(nickname: string): Player {
        let player: Player;
        this.playerMap.forEach(p => {
            if (p.nickname === nickname) {
                player = p;
            }
        });
        return player;
    }

    public save(player: Player): void {
        this.playerMap.set(player.id, player);
    }

    public update(playerId: string, playerData: Partial<Player>): Player {
        let player = this.playerMap.get(playerId);
        player = Object.assign(player, playerData);
        return player;
    }

    private playerMap: Map<string, Player> = new Map();
}