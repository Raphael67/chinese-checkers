import { Game } from './game.class';

interface IBotService {
    generateMove(game: Game): ICoords[];
}


export class BotService implements IBotService {
    public generateMove(game: Game): ICoords[] {
        throw new Error('Method not implemented.');
    }

}