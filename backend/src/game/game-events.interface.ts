import { EventEmitter } from 'events';
import { Game } from './game.class';

export interface IGameEvents extends EventEmitter {
    on(event: 'NEXT_PLAYER', listener: (game: Game) => void): this;
    on(event: 'GAME_STATE', listener: (game: Game) => void): this;

    emit(event: 'NEXT_PLAYER', game: Game): boolean;
    emit(event: 'GAME_STATE', game: Game): boolean;
}