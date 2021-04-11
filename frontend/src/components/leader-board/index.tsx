import pages from 'pages';
import React, { ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getGames } from 'redux/actions/game.action';
import Api from 'services/api';
import LeaderBoardComponent from './component';
import './index.less';

export enum Sort {
    Date,
    NumberOfRounds
}

const LeaderBoard = (): ReactElement => {
    const history = useHistory();

    const [topPlayers, setTopPlayers] = useState<IPlayer[]>([]);
    const [gamesPlayed, setGamesPlayed] = useState<IGame[]>([]);

    const createGame = async () => {
        try {
            history.push(pages.login.path.replace(':gameId', (await Api.newGame().catch((err) => {
                throw err;
            })).id));
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

    const replayGame = (id: string) => {
        history.push(pages.game.path.replace(':gameId', id));
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

    return <LeaderBoardComponent onSearch={searchGames} topPlayers={topPlayers} gamesPlayed={gamesPlayed} createGame={createGame} replayGame={replayGame} />;
};

export default LeaderBoard;
