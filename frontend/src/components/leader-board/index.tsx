import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import pages from '../../pages';
import Api from '../../services/api';
import { Colour } from '../game/board';
import LeaderBoardComponent from './component';
import './index.less';

const LeaderBoard = (): ReactElement => {
    const history = useHistory();

    const [topPlayers, setTopPlayers] = useState<IPlayer[]>([]);

    const newGame = async () => {
        try {
            const game = await Api.newGame();
            history.push(pages.login.path.replace(':gameId', game.id));
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setTopPlayers(await Api.getPlayers());
            }
            catch (err) {
                console.error(err);
            }
        })();
    }, []);

    return <LeaderBoardComponent topPlayers={topPlayers} gamesPlayed={[{
        date: new Date('2020-01-02'),
        id: 'fdg',
        rounds: 6,
        createdAt: new Date('2020-01-01'),
        status: 'CREATED',
        gamePlayers: [{
            id: 1,
            createdAt: new Date('2020-01-02'),
            colour: Colour.Blue,
            nickname: 'dfg',
            status: 'idle'
        }, {
            id: 2,
            createdAt: new Date('2020-01-03'),
            colour: Colour.Yellow,
            nickname: 'sdfsd',
            status: 'disconnected'
        }]
    },
    ]} newGame={newGame} />;
};

export default LeaderBoard;
