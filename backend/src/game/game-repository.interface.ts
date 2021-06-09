import { Game } from './game.class';

export interface IGameRepository {
    findFinishedGame(): Promise<Game[]>;
    save(game: Game): Promise<void>;
    findOne(gameId: string): Promise<Game | undefined>;
    update(gameId: string, gameData: Partial<Game>): Promise<Game>;
}