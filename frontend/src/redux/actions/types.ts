export enum Type {
    SET_PLAYER,
    SET_POSSIBLE_PLACES,
    SET_PATH,
    SET_PAWN_PLACE
}
export interface ISetPlayerAction {
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

export type ActionTypes = ISetPlayerAction | ISetPossiblePlaces | ISetPath | ISetPawnPlace;
