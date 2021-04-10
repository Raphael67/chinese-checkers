export enum Type {
    SET_PLAYER,
    SET_POSSIBLE_PLACES,
    SET_PATH,
    SET_PAWN_PLACE,
    SET_GAME,
    RESET_SESSION
}
export interface ISetPlayer {
    payload: IPlayer;
    type: Type.SET_PLAYER;
}

export interface ISetPossiblePlaces {
    payload: string[];
    type: Type.SET_POSSIBLE_PLACES;
}

export interface ISetPath {
    payload: string[];
    type: Type.SET_PATH;
}

export interface ISetPawnPlace {
    payload: IPawnPlace;
    type: Type.SET_PAWN_PLACE;
}

export interface ISetGame {
    payload: string;
    type: Type.SET_GAME;
}

export interface IResetSession {
    type: Type.RESET_SESSION;
}

export type ActionTypes = ISetPlayer | ISetPossiblePlaces | ISetPath | ISetPawnPlace | ISetGame | IResetSession;
