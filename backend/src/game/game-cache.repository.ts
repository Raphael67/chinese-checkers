import { Injectable } from '@nestjs/common';
import { IGameRepository } from './game-repository.interface';
import { Game } from './game.class';

@Injectable()
export class CacheGameRepository implements IGameRepository {

    public async find(): Promise<Game[]> {
        const games: Game[] = [];
        this.gameMap.forEach(game => games.push(game));
        return games;
    }

    public async save(game: Game): Promise<void> {
        this.gameMap.set(game.id, game);
    }

    public async findOne(gameId: string): Promise<Game | undefined> {
        return this.gameMap.get(gameId);
    }

    public async update(gameId: string, playerData: Partial<Game>): Promise<Game> {
        let game = this.gameMap.get(gameId);
        game = Object.assign(game, playerData);
        return game;
    }

    private gameMap: Map<string, Game> = new Map();
}