import { WithLogged } from 'components/services';
import { Colour } from 'core/board';
import pages from 'pages';
import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { reset } from 'redux/actions/session.action';
import { AppState } from 'redux/reducers';
import Api from 'services/api';
import { AppContext } from '../..';
import GameComponent from './component';
import './index.less';

const Game = (): ReactElement => {
    const dispatch = useDispatch();
    const { game } = useContext(AppContext);

    const history = useHistory();
    const gameParams = useParams<IGameParams>();

    const [currentGame, setCurrentGame] = useState<IGame>();

    const timer = useRef<NodeJS.Timeout>();

    const mapStateToObj = useSelector((state: AppState) => {
        const { player } = state.session;
        return {
            player
        };
    });

    useEffect(() => {
        (async () => {
            clearInterval(Number(timer.current));
            const gameId = gameParams.gameId;
            game.setId(gameId);
            game.setPlayerColour(mapStateToObj.player!.colour || Colour.Black);
            timer.current = setInterval(async () => {
                setCurrentGame(await Api.getGame({
                    gameId
                }).catch((err) => {
                    throw err;
                }));
            }, 2000);
        })();

        return () => {
            clearInterval(Number(timer.current));
        };
    }, [game, gameParams.gameId, mapStateToObj.player]);

    const quitGame = () => {
        reset(dispatch);
        history.push(pages.leaderBoard.path);
    };

    return <GameComponent quitGame={quitGame} game={currentGame} />;
};

export default WithLogged(Game, ['game', 'player']);
