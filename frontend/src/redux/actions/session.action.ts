import { Dispatch } from 'react';
import { IInitSessionAction } from 'redux/actions/types';
import Api from 'services/api';

export const register = async (dispatch: Dispatch<IInitSessionAction>, params: IRegisterParams) => {
    await Api.register(params);
};
