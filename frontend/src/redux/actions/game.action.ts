import { Dispatch } from 'react';
import { ISetPath, ISetPawnPlace, ISetPossiblePlaces, Type } from 'redux/actions/types';

export const setPossiblePlaces = async (dispatch: Dispatch<ISetPossiblePlaces>, possiblePlaces: string[]) => {
    dispatch({
        payload: possiblePlaces,
        type: Type.SET_POSSIBLE_PLACES
    });
};

export const setPath = async (dispatch: Dispatch<ISetPath>, path: string[]) => {
    dispatch({
        payload: path,
        type: Type.SET_PATH
    });
};

export const setPawnPlace = async (dispatch: Dispatch<ISetPawnPlace>, pawn: string, place: string) => {
    dispatch({
        payload: {
            pawn,
            place
        },
        type: Type.SET_PAWN_PLACE
    });
};
