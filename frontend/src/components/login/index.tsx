import LoginComponent from 'components/login/component';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { register } from 'redux/actions/session.action';
import pages from '../../pages';
import Api from '../../services/api';
import { Colour } from '../game/board';

const Login = (): ReactElement => {
    const dispatch = useDispatch();
    const gameParams = useParams<IGameParams>();

    const [errorMessage] = useState<string>();
    const [game, setGame] = useState<IGame>();

    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                setGame(await Api.getGame({
                    gameId: gameParams.gameId
                }));
            }
            catch (err) {
                console.error(err);
            }
        })();

    }, [gameParams.gameId]);

    const registerDispatch = (params: IRegisterParams) => {
        register(dispatch, gameParams, params);
    };

    const goToGame = () => {
        history.push(pages.game.path);
    };

    return <LoginComponent players={[{
        id: 1,
        createdAt: new Date('2020-01-01'),
        colour: Colour.Yellow,
        nickname: 'sdfsd',
        status: 'disconnected'
    }, {
        id: 2,
        createdAt: new Date('2020-01-01'),
        colour: Colour.Black,
        nickname: 'gg',
        status: 'idle'
    }]} login={registerDispatch} goToGame={goToGame} errorMessage={errorMessage} />;
};

export default Login;
