import { Dispatch } from 'react';
import { IInitSessionAction } from 'redux/actions/types';
import Api from 'services/api';

export const register = async (dispatch: Dispatch<IInitSessionAction>, gameParams: IGameParams, params: IRegisterParams) => {
    await Api.register(gameParams, params);
};
