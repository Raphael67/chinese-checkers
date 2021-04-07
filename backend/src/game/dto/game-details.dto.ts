import { Color } from '../game-player.entity';

export class GameDetailsDto {
    public game_id: string;
    public rounds: number;
    public longest_streak: number;
    public created_at: Date;
    public players: {
        nickname: string;
        color: Color;
    }[] = [];
}