import pages from 'pages';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { getGames, newGame } from 'redux/actions/game.action';
import Api from 'services/api';
import LeaderBoardComponent from './component';
import './index.less';

export enum Sort {
    Date,
    NumberOfRounds
}

const LeaderBoard = (): ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [topPlayers, setTopPlayers] = useState<IPlayer[]>([]);
    const [gamesPlayed, setGamesPlayed] = useState<IGame[]>([]);

    const createGame = async () => {
        try {
            const game = await newGame(dispatch).catch((err) => {
                throw err;
            });

            history.push(pages.login.path.replace(':gameId', game.id));
        }
        catch (err) {
            console.error(err);
        }
    };

    const searchGames = async (values: ISearchGameParams) => {
        try {
            setGamesPlayed(await getGames(values).catch((err) => {
                throw err;
            }));
        }
        catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        (async () => {
            setTopPlayers(await Api.getPlayers().catch((err) => {
                throw err;
            }) || []);
        })().catch((err) => {
            console.error(err);
        });
    }, []);

    return <LeaderBoardComponent onSearch={searchGames} topPlayers={topPlayers} gamesPlayed={gamesPlayed} createGame={createGame} />;
};

export default LeaderBoard;
