import LoginComponent from 'components/login/component';
import pages from 'pages';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { register } from 'redux/actions/session.action';
import { AppContext } from '../..';

const Login = (): ReactElement | null => {
    const { game } = useContext(AppContext);
    const dispatch = useDispatch();
    const gameParams = useParams<IGameParams>();

    const [errorMessage] = useState<string>();

    const [currentGame, setCurrentGame] = useState<IGame>();

    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                setCurrentGame(await game.getAndStoreGame(gameParams.gameId).catch((err) => {
                    throw err;
                }));
            }
            catch (err) {
                console.error(err);
            }
        })();

    }, [gameParams.gameId, game, dispatch]);

    const login = async (playerName: string, position: number) => {
        try {
            await register(dispatch, gameParams, {
                nickname: playerName,
                position
            }).catch((err) => {
                throw err;
            });

            goToGame();
        }
        catch (err) {
            console.error(err);
        }
    };

    const goToGame = () => {
        history.push(pages.game.path.replace(':gameId', gameParams.gameId));
    };

    return game ? <LoginComponent game={currentGame} login={login} goToGame={goToGame} errorMessage={errorMessage} /> : null;
};

export default Login;
