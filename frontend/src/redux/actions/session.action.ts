import { Dispatch } from 'react';
import { IResetSession, ISetPlayer, Type } from 'redux/actions/types';
import Api from 'services/api';

export const register = async (dispatch: Dispatch<ISetPlayer>, gameParams: IGameParams, params: IRegisterParams) => {
    await Api.register(gameParams, params).catch((err) => {
        throw err;
    });

    const { nickname, position } = params;
    dispatch({
        payload: {
            nickname,
            position
        },
        type: Type.SET_PLAYER
    });
};

export const reset = (dispatch: Dispatch<IResetSession>) => {
    dispatch({
        type: Type.RESET_SESSION
    });
};