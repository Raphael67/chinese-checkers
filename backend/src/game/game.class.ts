
import { v4 as uuid } from 'uuid';
import { Board, Coords } from '../board/board';
import { Player } from '../player/player.class';

export enum GameStatus {
    CREATED = 'CREATED',
    STARTED = 'STARTED',
    FINISHED = 'FINISHED',
}

export class Game {
    public id: string = uuid();
    public players: Player[] = [];
    public status: GameStatus = GameStatus.CREATED;
    public currentPlayer: number = -1;
    public creator: string;
    public turn: number = 0;
    public longestStreak: number = 0;
    public winner: string;

    public board: Board = new Board();

    public moves: Coords[][] = [];
    public createdAt: Date;
}