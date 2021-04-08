import jwt from 'jsonwebtoken';
import { ActionTypes, Type } from 'redux/actions/types';

export interface ISessionState {
    token?: string;
    error?: any;
    user?: IUser;
}

const defaultState: ISessionState = {
    token: undefined,
    error: undefined,
    user: undefined,
};

const savedState: ISessionState = defaultState;

if (localStorage.getItem('sessionState')) {
    const sessionStateSaved = JSON.parse(localStorage.getItem('sessionState') as string);
    if ('accessToken' in sessionStateSaved) {
        const accessToken = sessionStateSaved.accessToken;
        const tokenInfo = jwt.decode(accessToken);
        if (tokenInfo && typeof (tokenInfo) === 'object' && 'exp' in tokenInfo && tokenInfo.exp > Date.now() / 1000) {
            savedState.token = accessToken;
            savedState.user = sessionStateSaved.user || undefined;
        }
    }
}

const session = (state: ISessionState = savedState, action: ActionTypes) => {
    let temporaryState: ISessionState = { ...state };
    switch (action.type) {
        case Type.INIT_SESSION:
            temporaryState = { ...temporaryState, ...action.payload };
            break;
        case Type.SET_USER:
            temporaryState.user = action.payload.user;
            break;
        default:
    }
    localStorage.setItem('sessionState', JSON.stringify(temporaryState));
    return temporaryState;
};

export default session;
