import { Injectable } from '@nestjs/common';
import { Game } from './game.entity';

@Injectable()
export class CacheGameRepository {

    public find(): Game[] {
        const games = [];
        this.gameMap.forEach(game => games.push(game));
        return games;
    }

    public save(game: Game): void {
        this.gameMap.set(game.id, game);
    }

    public findOne(gameId: string): Game | undefined {
        return this.gameMap.get(gameId);
    }

    public findByPlayerNickname(nickname: string): Game[] {
        return this.find().filter((game) => !!game.players.find(player => player && player.nickname === nickname));
    }

    public update(gameId: string, playerData: Partial<Game>): Game {
        let game = this.gameMap.get(gameId);
        game = Object.assign(game, playerData);
        return game;
    }

    private gameMap: Map<string, Game> = new Map();
}