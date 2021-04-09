import { ActionTypes, Type } from 'redux/actions/types';

export interface ISessionState {
    player?: IPlayer;
}

const defaultState: ISessionState = {
    player: undefined
};

const savedState: ISessionState = defaultState;

if (localStorage.getItem('sessionState')) {
    const sessionStateSaved = JSON.parse(localStorage.getItem('sessionState') as string);
    if ('player' in sessionStateSaved) {
        savedState.player = sessionStateSaved.player;
    }
}

const session = (state: ISessionState = savedState, action: ActionTypes) => {
    let temporaryState: ISessionState = { ...state };
    switch (action.type) {
        case Type.SET_PLAYER:
            temporaryState.player = action.payload;
            break;
        default:
    }
    localStorage.setItem('sessionState', JSON.stringify(temporaryState));
    return temporaryState;
};

export default session;
