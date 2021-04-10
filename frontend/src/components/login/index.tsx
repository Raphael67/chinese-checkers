import LoginComponent from 'components/login/component';
import { Colour, ColourMapReverse } from 'core/board';
import pages from 'pages';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { register } from 'redux/actions/session.action';
import Api from 'services/api';

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
                }).catch((err) => {
                    throw err;
                }));
            }
            catch (err) {
                console.error(err);
            }
        })();

    }, [gameParams.gameId]);

    const login = async (playerName: string, colour: Colour) => {
        try {
            await register(dispatch, gameParams, {
                nickname: playerName,
                color: ColourMapReverse[colour]
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

    return <LoginComponent game={game} login={login} goToGame={goToGame} errorMessage={errorMessage} />;
};

export default Login;
