import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppState } from 'redux/reducers';
import { AppContext } from '../..';
import GameComponent from './component';
import './index.less';

const Replay = (): ReactElement => {
    const { game } = useContext(AppContext);

    const gameParams = useParams<IGameParams>();

    const [currentGame, setCurrentGame] = useState<IGame>();

    const mapStateToObj = useSelector((state: AppState) => {
        const { player } = state.session;
        return {
            player
        };
    });

    useEffect(() => {
        (async () => {
            const gameId = gameParams.gameId;
            game.setId(gameId);

            const gameInfo = await game.getGame(gameId).catch((err) => {
                throw err;
            });
            setCurrentGame(gameInfo);
            game.setPlayerPosition(gameInfo.currentPlayer);
        })();
    }, [game, gameParams.gameId]);

    return <GameComponent
        game={currentGame}
        player={mapStateToObj.player}
    />;
};

export default Replay;
