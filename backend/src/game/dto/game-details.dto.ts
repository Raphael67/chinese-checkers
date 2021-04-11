import { ApiResponseProperty } from '@nestjs/swagger';
import { Color } from '../game-player.entity';
import { Game } from '../game.entity';

class GamePlayer {
    @ApiResponseProperty()
    nickname: String;
    @ApiResponseProperty()
    color: Color;
}

export class GameDetailsDto {
    constructor(
        game: Game,
    ) {
        this.created_at = game.createdAt;
        this.game_id = game.id;
        this.longest_streak = game.longestStreak;
        this.rounds = game.rounds;
        this.players = game.gamePlayers.map((gamePlayer) => {
            return {
                nickname: gamePlayer.player.nickname,
                color: gamePlayer.color
            };
        });
    }

    @ApiResponseProperty()
    public game_id: string;
    @ApiResponseProperty()
    public rounds: number;
    @ApiResponseProperty()
    public longest_streak: number;
    @ApiResponseProperty()
    public created_at: Date;
    @ApiResponseProperty({
        type: [GamePlayer]
    })
    public players: {
        nickname: string;
        color: Color;
    }[] = [];
}