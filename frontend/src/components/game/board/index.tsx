import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppState } from 'redux/reducers';
import { AppContext } from '../../..';
import BoardComponent from './component';
import './index.less';

export interface IHashPawnPlaces {
    pawns: IPawnPlace[];
    hash: string;
}

export interface IHashPossiblePlaces {
    possiblePlaces: string[];
    hash: string;
}

export interface IHashPath {
    path: string[];
    hash: string;
}
export interface IHashPossiblePlaces {
    possiblePlaces: string[];
    hash: string;
}

const Board = (): ReactElement => {
    const { game } = useContext(AppContext);
    const timer = useRef<NodeJS.Timeout>();
    const gameParams = useParams<IGameParams>();
    const [pawns, setPawns] = useState<IHashPawnPlaces>({
        pawns: [],
        hash: ''
    });

    const mapStateToObj = useSelector((state: AppState) => {
        const { possiblePlaces, pawnPlace, path, pawns } = state.game;
        const { player } = state.session;
        return {
            possiblePlaces: {
                possiblePlaces,
                hash: JSON.stringify(possiblePlaces)
            },
            pawnPlace,
            path: {
                path,
                hash: JSON.stringify(path)
            },
            player,
            pawns
        };
    });

    const refresh = useCallback(async () => {
        const moves = await game.getMoves(gameParams.gameId).catch((err) => {
            console.error(err);
        });
        const pawns = mapStateToObj.pawns;
        setPawns({
            pawns,
            hash: JSON.stringify(pawns)
        });

        timer.current = setTimeout(async () => {
            await refresh();
        }, 2000);
    }, [game, gameParams.gameId, mapStateToObj.pawns]);

    useEffect(() => {
        (async () => {
            await refresh();
        })();

        return () => {
            clearTimeout(Number(timer.current));
        };
    }, [refresh]);

    // Init board
    useEffect(() => {
        (async () => {
            await game.initBoard(gameParams.gameId).catch((err) => {
                console.error(err);
            });
        })();
    }, [game, gameParams.gameId]);

    const clickPlace = (place: string) => {
        game.clickPlace(place);
    };

    const doubleClickPlace = (place: string) => {
        game.doubleClickPlace(place);
    };

    return <BoardComponent
        pawns={pawns}
        player={mapStateToObj.player}
        placesHighlighted={mapStateToObj.possiblePlaces}
        pawnPlace={mapStateToObj.pawnPlace}
        path={mapStateToObj.path}
        clickPlace={clickPlace}
        doubleClickPlace={doubleClickPlace}
    />;
};
export default Board;