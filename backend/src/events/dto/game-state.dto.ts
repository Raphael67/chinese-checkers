import { Game, GameStatus } from '../../game/game.class';

export class GameStateDto {
    public status: GameStatus = GameStatus.STARTED;
    public turn: number = 0;
    public current_player: number = -1;
    public longest_streak: number = 0;

    public static from(game: Game): GameStateDto {
        const gameState = new GameStateDto();
        gameState.current_player = game.currentPlayer;
        gameState.longest_streak = game.longestStreak;
        gameState.status = game.status;
        gameState.turn = game.turn;
        return gameState;
    }
}