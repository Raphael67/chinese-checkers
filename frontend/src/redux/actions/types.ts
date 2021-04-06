export const INIT_SESSION = 'INIT_SESSION';
export const SET_USER = 'SET_USER';
export const SAVE_USER = 'SAVE_USER';

export interface ISessionPayload {
    accessToken?: string;
    error?: any;
    user?: IUser;
}

export interface IInitSessionAction {
    payload: ISessionPayload;
    type: typeof INIT_SESSION;
}

export interface IUserPayload {
    user?: IUser;
}

export interface ISetUserAction {
    payload: IUserPayload;
    type: typeof SET_USER;
}

export type ActionTypes = IInitSessionAction | ISetUserAction;
