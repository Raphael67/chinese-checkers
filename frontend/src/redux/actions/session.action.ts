import { ColourMap } from 'core/board';
import { Dispatch } from 'react';
import { ISetPlayerAction, Type } from 'redux/actions/types';
import Api from 'services/api';

export const register = async (dispatch: Dispatch<ISetPlayerAction>, gameParams: IGameParams, params: IRegisterParams) => {
    await Api.register(gameParams, params).catch((err) => {
        throw err;
    });

    dispatch({
        payload: {
            nickname: params.nickname,
            colour: ColourMap[params.color]
        },
        type: Type.SET_PLAYER
    });

};
