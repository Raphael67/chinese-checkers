import { Game, GameStatus } from '../../game/game.entity';

export class GameStateDto {
    public status: GameStatus;
    public turn: number;
    public current_player: number;
    public longest_streak: number;

    public static from(game: Game): GameStateDto {
        const gameState = new GameStateDto();
        gameState.current_player = game.currentPlayer;
        gameState.longest_streak = game.longestStreak;
        gameState.status = game.status;
        gameState.turn = game.turn;
        return gameState;
    }
}