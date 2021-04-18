import { EventEmitter } from 'events';
import { Coords } from '../board/board';
import { Game } from './game.entity';

export interface IGameEvents extends EventEmitter {
    on(event: 'MOVE', listener: (game: Game, move: Coords[]) => void): this;
    on(event: 'NEXT_PLAYER', listener: (game: Game) => void): this;
    on(event: 'GAME_STATE', listener: (game: Game) => void): this;

    emit(event: 'NEXT_PLAYER', game: Game): boolean;
    emit(event: 'MOVE', game: Game, move: Coords[]): boolean;
    emit(event: 'GAME_STATE', game: Game): boolean;
}