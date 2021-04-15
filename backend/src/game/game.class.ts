
import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import { Player } from '../player/player.class';
import { Board } from './board';

interface IGame {
    on(event: 'CURRENT_PLAYER', listener: () => void): this;
    on(event: 'MOVE', listener: () => void): this;
}

export enum GameStatus {
    'CREATED',
    'STARTED',
    'FINISHED',
}


export class Game extends EventEmitter implements IGame {
    public id: string = uuid();
    public players: Player[] = [];
    public status: GameStatus = GameStatus.CREATED;
    private currentPlayer: number = -1;
    public creator: number;
    public turn: number = 0;
    public longestStreak: number = 0;
    public winner: number;
    public board: Board = new Board();
    public moves: ICoords[][] = [];
    public createdAt: Date;

    public nextPlayer(): void {
        this.currentPlayer = (this.currentPlayer + 1) % 6;
        this.emit('CURRENT_PLAYER');
    }

    public getCurrentPlayer(): number {
        return this.currentPlayer;
    }
}