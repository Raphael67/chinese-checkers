import { ApiResponseProperty } from '@nestjs/swagger';
import { Player } from '../../player/player.class';
import { Game } from '../game.class';

class GamePlayer {
    @ApiResponseProperty()
    public nickname: string;
    @ApiResponseProperty()
    public position: number;
}

export class GameDetailsDto {
    public constructor(
        game: Game,
    ) {
        this.created_at = game.createdAt;
        this.id = game.id;
        this.longest_streak = game.longestStreak;
        this.turn = game.turn;
        this.players = game.players;
    }

    @ApiResponseProperty()
    public id: string;
    @ApiResponseProperty()
    public turn: number;
    @ApiResponseProperty()
    public longest_streak: number;
    @ApiResponseProperty()
    public created_at: Date;
    @ApiResponseProperty({
        type: [GamePlayer],
    })
    public players: Player[];
}