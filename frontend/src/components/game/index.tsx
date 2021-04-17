import pages from 'pages';
import React, { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { getGame } from 'redux/actions/game.action';
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

    const refresh = useCallback(async (gameId: string) => {
        setCurrentGame(await getGame(gameId).catch((err) => {
            throw err;
        }));
    }, []);

    useEffect(() => {
        (async () => {
            const gameId = gameParams.gameId;
            const player = mapStateToObj.player;
            game.setId(gameId);
            if (player && player.position !== undefined) {
                game.setPlayerPosition(player.position);
            }
            await refresh(gameId);
            clearInterval(Number(timer.current));
            timer.current = setInterval(async () => {
                await refresh(gameId);
            }, 2000);
        })();

        return () => {
            clearInterval(Number(timer.current));
        };
    }, [game, gameParams.gameId, mapStateToObj.player, refresh]);

    const quitGame = () => {
        reset(dispatch);
        history.push(pages.leaderBoard.path);
    };

    const startGame = () => {
        Api.startGame({
            gameId: gameParams.gameId
        });
    };

    const copyGameLink = () => {
        const copyLinkElement = document.getElementById('copy-link') as HTMLInputElement;
        if (copyLinkElement) {
            copyLinkElement.focus();
            copyLinkElement.select();
            document.execCommand('copy');
        }
    };

    const getInviteLink = (): string => {
        const { protocol, port, hostname } = document.location;
        return protocol + '//' + hostname + (port !== '' ? ':' + port : '') + pages.login.path.replace(':gameId', gameParams.gameId);
    };

    return <GameComponent copyGameLink={copyGameLink} getInviteLink={getInviteLink} quitGame={quitGame} startGame={startGame} game={currentGame} player={mapStateToObj.player} />;
};

export default Game;
