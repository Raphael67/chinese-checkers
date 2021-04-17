import { ActionTypes, Type } from 'redux/actions/types';

export interface IGameState {
    possiblePlaces: string[];
    path: string[];
    pawnPlace?: IPawnPlace;
    pawns: IPawnPlace[];
}

const defaultState: IGameState = {
    possiblePlaces: [],
    path: [],
    pawns: []
};

const savedState: IGameState = defaultState;

const game = (state: IGameState = savedState, action: ActionTypes) => {
    let temporaryState: IGameState = { ...state };
    switch (action.type) {
        case Type.SET_POSSIBLE_PLACES:
            temporaryState = { ...temporaryState, possiblePlaces: action.payload };
            break;

        case Type.SET_PATH:
            temporaryState = { ...temporaryState, path: action.payload };
            break;

        case Type.SET_PAWN_PLACE:
            temporaryState = { ...temporaryState, pawnPlace: action.payload };
            break;

        case Type.SET_PAWNS:
            temporaryState = { ...temporaryState, pawns: action.payload };
            break;
        default:
    }
    return temporaryState;
};

export default game;
