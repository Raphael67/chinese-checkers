import React, { ReactElement } from 'react';
import { useHistory } from 'react-router';
import pages from '../../pages';
import { Colour } from '../game/board';
import LeaderBoardComponent from './component';
import './index.less';

const LeaderBoard = (): ReactElement => {
    const history = useHistory();

    const newGame = () => {
        history.push(pages.login.path);
    };

    return <LeaderBoardComponent topPlayers={[{
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    {
        name: 'dfgdf'
    },
    ]} gamesPlayed={[{
        date: new Date('2020-01-02'),
        id: 'fdg',
        numberOfRounds: 6,
        players: [{
            name: 'yukjyu',
            colour: Colour.Blue,
        },
        {
            name: 'ereze',
            colour: Colour.Yellow,
        },
        {
            name: 'yez',
            colour: Colour.Green,
        }]
    },
    {
        date: new Date('2020-01-02'),
        id: 'fdfg',
        numberOfRounds: 10,
        players: [{
            name: 'ghf',
            colour: Colour.Red,
        },
        {
            name: 'eresdsdfsdfsdffzsqefe',
            colour: Colour.Black,
        },
        {
            name: 'gg',
            colour: Colour.Green,
        },
        {
            name: 'qsdqd',
            colour: Colour.Yellow,
        }]
    }]} newGame={newGame} />;
};

export default LeaderBoard;
