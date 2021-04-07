import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';
import pages from '../../pages';
import GameComponent from './component';
import './index.less';

const Game = (): ReactElement => {
    const history = useHistory();

    const quitGame = () => {
        history.push(pages.leaderBoard.path);
    };

    return <GameComponent quitGame={quitGame} />;
};

export default Game;
