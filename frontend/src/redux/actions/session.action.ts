import { Dispatch } from 'react';
import { ISetPlayerAction, Type } from 'redux/actions/types';
import Api from 'services/api';
import { ColourMap } from '../../core/board';

export const register = async (dispatch: Dispatch<ISetPlayerAction>, gameParams: IGameParams, params: IRegisterParams) => {
    try {
        await Api.register(gameParams, params);
        dispatch({
            payload: {
                nickname: params.nickname,
                colour: ColourMap[params.color]
            },
            type: Type.SET_PLAYER
        });
    }
    catch (err) {
        throw err;
    }
};
