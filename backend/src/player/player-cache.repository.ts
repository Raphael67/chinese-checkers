import { Injectable } from '@nestjs/common';
import { Player } from './player.class';

@Injectable()
export class PlayerCacheRepository {

    public find(): Player[] {
        const players = [];
        this.playerMap.forEach(player => players.push(player));
        return players;
    }

    public async findOneByNickname(nickname: string): Promise<Player> {
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

    public async save(player: Player): Promise<void> {
        this.playerMap.set(player.nickname, player);
    }

    public async update(nickname: string, playerData: Partial<Player>): Promise<Player> {
        let player = this.playerMap.get(nickname);
        player = Object.assign(player, playerData);
        return player;
    }

    private playerMap: Map<string, Player> = new Map();
}