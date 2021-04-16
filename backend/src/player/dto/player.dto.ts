import { PlayerEntity } from '../player.entity';

export class PlayerDto {
    public constructor(player: PlayerEntity) {
        this.id = player.id;
        this.nickname = player.nickname;
        this.win = player.win;
        this.lose = player.lose;
        this.rating = player.rating;
    }

    public id: number;
    public nickname: string;
    public win: number;
    public lose: number;
    public rating: number;
}