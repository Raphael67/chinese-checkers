import pages from 'pages';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Api from 'services/api';
import { AppContext } from '../..';
import GameComponent from './component';
import './index.less';

const Game = (): ReactElement => {
    const { game } = useContext(AppContext);

    const history = useHistory();
    const gameParams = useParams<IGameParams>();

    const [currentGame, setCurrentGame] = useState<IGame>();

    /*const mapStateToObj = useSelector((state: AppState) => {
        const { player } = state.session;
        return {
            player
        };
    });*/

    useEffect(() => {
        (async () => {
            const gameId = gameParams.gameId;
            setCurrentGame(await Api.getGame({
                gameId
            }).catch((err) => {
                throw err;
            }));

            game.setId(gameId);
            //game.setPlayerId(mapStateToObj.player.id);

        })().catch((err) => {
            console.error(err);
        });
    }, [game, gameParams.gameId]);

    const quitGame = () => {
        history.push(pages.leaderBoard.path);
    };

    return <GameComponent quitGame={quitGame} game={currentGame} />;
};

export default Game;
