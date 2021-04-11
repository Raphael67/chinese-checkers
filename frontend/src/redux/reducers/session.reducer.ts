import { ActionTypes, Type } from 'redux/actions/types';

export interface ISessionState {
    player?: IPlayer;
    game?: string;
}

const defaultState: ISessionState = {
    player: undefined,
    game: undefined
};

const savedState: ISessionState = { ...defaultState };

if (localStorage.getItem('sessionState')) {
    const sessionStateSaved = JSON.parse(localStorage.getItem('sessionState') as string);
    if ('player' in sessionStateSaved) {
        savedState.player = sessionStateSaved.player;
    }
    if ('game' in sessionStateSaved) {
        savedState.game = sessionStateSaved.game;
    }
}

const session = (state: ISessionState = savedState, action: ActionTypes) => {
    let temporaryState: ISessionState = { ...state };
    switch (action.type) {
        case Type.SET_PLAYER:
            temporaryState.player = action.payload;
            break;
        case Type.SET_GAME:
            temporaryState.player = undefined;
            temporaryState.game = action.payload;
            break;
        case Type.RESET_SESSION:
            temporaryState = defaultState;
            break;
        default:
    }
    localStorage.setItem('sessionState', JSON.stringify(temporaryState));
    return temporaryState;
};

export default session;
