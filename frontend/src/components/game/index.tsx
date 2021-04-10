import pages from 'pages';
import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Api from 'services/api';
import GameComponent from './component';
import './index.less';

const Game = (): ReactElement => {
    const history = useHistory();
    const gameParams = useParams<IGameParams>();

    const [game, setGame] = useState<IGame>();

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

    const quitGame = () => {
        history.push(pages.leaderBoard.path);
    };

    return <GameComponent quitGame={quitGame} game={game} />;
};

export default Game;
