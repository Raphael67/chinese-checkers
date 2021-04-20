import { Game } from './game.class';

export interface IGameRepository {
    find(): Promise<Game[]>;
    save(game: Game): Promise<void>;
    findOne(gameId: string): Promise<Game>;
    update(gameId: string, gameData: Partial<Game>): Promise<Game>;
}