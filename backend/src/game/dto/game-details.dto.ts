import { Game, GameStatus } from '../game.class';

class GamePlayerDto {
    public nickname: string;
    public position: number;
}

export class GameDetailsDto {
    public constructor(
        game: Game,
    ) {
        this.created_at = game.createdAt;
        this.id = game.id;
        this.status = game.status;
        this.longest_streak = game.longestStreak;
        this.turn = game.turn;
        this.current_player = game.currentPlayer;
        this.players = game.players
            .map((player, index) => {
                if (!player) return;
                const gamePlayerDto = new GamePlayerDto();
                gamePlayerDto.nickname = player.nickname;
                gamePlayerDto.position = index;
                return gamePlayerDto;
            });
    }

    public id: string;
    public status: GameStatus;
    public turn: number;
    public current_player: number;
    public longest_streak: number;
    public created_at: Date;
    public players: GamePlayerDto[];
}