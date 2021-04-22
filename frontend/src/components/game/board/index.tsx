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

interface IProps {
    game?: IGame;
    setPlayerPlaying: (position: number) => void;
}

const Board = (props: IProps): ReactElement => {
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

    const { game } = useContext(AppContext);
    const timer = useRef<NodeJS.Timeout>();
    const gameParams = useParams<IGameParams>();
    const [pawns, setPawns] = useState<IHashPawnPlaces>({
        pawns: [],
        hash: ''
    });

    //const setPlayerPlaying = props.setPlayerPlaying;

    const replayMoves = useCallback(async () => {
        let movesIterator = game.replayMoves(gameParams.gameId);
        let nextValue = await movesIterator.next();
        while (!nextValue.done) {
            const value = nextValue.value;
            if (value) {
                const [position, move] = value;
                if (position !== undefined) {
                    //setPlayerPlaying(Number(position));
                }

                if (move) {
                    //setPawnPlace(move);
                }

            }
            nextValue = await movesIterator.next();
        }
    }, [game, gameParams.gameId]);

    const refresh = useCallback(async () => {
        clearTimeout(Number(timer.current));
        try {
            await replayMoves();

            timer.current = setTimeout(async () => {
                await refresh();
            }, 2000);
        }
        catch (err) {
            console.error(err);
        }
    }, [replayMoves]);

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

    // Set board initially
    useEffect(() => {
        const pawns = mapStateToObj.pawns;
        setPawns({
            pawns,
            hash: JSON.stringify(pawns)
        });
    }, [mapStateToObj.pawns]);

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
        path={mapStateToObj.path}
        clickPlace={clickPlace}
        doubleClickPlace={doubleClickPlace}
        game={props.game}
    />;
};
export default Board;