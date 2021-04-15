import { ApiResponseProperty } from '@nestjs/swagger';
import { Game } from '../game.class';

class GamePlayerDto {
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
        this.currentPlayer = game.getCurrentPlayer();
        this.players = game.players.map((player, index) => {
            const gamePlayerDto = new GamePlayerDto();
            gamePlayerDto.nickname = player.nickname;
            gamePlayerDto.position = index;
            return gamePlayerDto;
        });
    }

    @ApiResponseProperty()
    public id: string;
    @ApiResponseProperty()
    public turn: number;
    @ApiResponseProperty()
    public currentPlayer: number;
    @ApiResponseProperty()
    public longest_streak: number;
    @ApiResponseProperty()
    public created_at: Date;
    @ApiResponseProperty({
        type: [GamePlayerDto],
    })
    public players: GamePlayerDto[];
}