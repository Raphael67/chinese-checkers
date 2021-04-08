export enum Type {
    INIT_SESSION,
    SET_USER,
    SAVE_USER,
    SET_POSSIBLE_PLACES,
    SET_PATH,
    SET_PAWN_PLACE
}

export interface ISessionPayload {
    accessToken?: string;
    error?: any;
    user?: IUser;
}

export interface IInitSessionAction {
    payload: ISessionPayload;
    type: Type.INIT_SESSION;
}

export interface IUserPayload {
    user?: IUser;
}

export interface ISetUserAction {
    payload: IUserPayload;
    type: Type.SET_USER;
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

export type ActionTypes = IInitSessionAction | ISetUserAction | ISetPossiblePlaces | ISetPath | ISetPawnPlace;
