import { Injectable } from '@nestjs/common';
import { Game } from './game.class';

@Injectable()
export class CacheGameRepository {
    public save(game: Game): void {
        this.games.set(game.id, game);
    }

    public findOne(gameId: string): Game | undefined {
        return this.games.get(gameId);
    }

    private games: Map<string, Game> = new Map();
}