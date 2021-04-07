import LoginComponent from 'components/login/component';
import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { register } from 'redux/actions/session.action';
import pages from '../../pages';
import { Colour } from '../game/board';

const Login = (): ReactElement => {
    const dispatch = useDispatch();
    //const params = useParams<IGame>();


    const [errorMessage] = useState<string | undefined>(undefined);
    const history = useHistory();

    const registerDispatch = (params: IRegisterParams) => {
        register(dispatch, params);
    };

    const goToGame = () => {
        history.push(pages.game.path);
    };

    return <LoginComponent players={[{
        colour: Colour.Blue,
        name: 'dfg',
        status: 'idle'
    }, {
        colour: Colour.Yellow,
        name: 'sdfsd',
        status: 'disconnected'
    }]} login={registerDispatch} goToGame={goToGame} errorMessage={errorMessage} />;
};

export default Login;
