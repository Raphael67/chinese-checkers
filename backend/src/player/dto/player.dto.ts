import { Player } from '../player.class';

export class PlayerDto {
    public constructor(player: Player) {
        this.nickname = player.nickname;
        this.win = player.wins;
        this.lose = player.loses;
        this.rating = player.rating;
    }

    public nickname: string;
    public win: number;
    public lose: number;
    public rating: number;
}