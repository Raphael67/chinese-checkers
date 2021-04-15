import { ApiResponseProperty } from '@nestjs/swagger';
import { PlayerEntity } from '../player.entity';

export class PlayerDto {
    constructor(player: PlayerEntity) {
        this.id = player.id;
        this.nickname = player.nickname;
        this.win = player.win;
        this.lose = player.lose;
        this.rating = player.rating;
    }

    @ApiResponseProperty()
    public id: number;
    @ApiResponseProperty()
    public nickname: string;
    @ApiResponseProperty()
    public win: number;
    @ApiResponseProperty()
    public lose: number;
    @ApiResponseProperty()
    public rating: number;
}