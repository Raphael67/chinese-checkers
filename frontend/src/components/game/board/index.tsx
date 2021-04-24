import { ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppState } from 'redux/reducers';
import { AppContext } from '../../..';
import { PawnTransitionDurations } from '../pawn';
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
    currentPlayerPosition?: number;
    player?: IPlayer;
}

const PawnTransitionDuration = PawnTransitionDurations.reduce((total: number, transitionDuration: number) => total + transitionDuration, 0);

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
    const isUnmounted = useRef<boolean>(false);
    const gameParams = useParams<IGameParams>();
    const [pawns, setPawns] = useState<IHashPawnPlaces>({
        pawns: [],
        hash: ''
    });

    const setPlayerPlaying = (position: number) => {
        let element = document.querySelector(`[data-position="${position}"]`);
        if (element) {
            document.querySelectorAll(`[data-position]`).forEach((element: Element) => {
                element.classList.remove('playing');
            });
            element.classList.add('playing');
        }
    };

    const replayMoves = useCallback(async () => {
        let movesIterator = game.replayMoves(gameParams.gameId);
        let nextValue = await movesIterator.next();

        while (!nextValue.done && !isUnmounted.current) {
            const value = nextValue.value;
            if (value) {
                const [position, pawns] = value;
                if (position !== undefined) {
                    setPlayerPlaying(Number(position));
                }

                if (pawns) {
                    setPawns({
                        pawns,
                        hash: JSON.stringify(pawns)
                    });
                }

            }
            nextValue = await movesIterator.next();
        }

        const player = props.player;
        if (game.getStatus() === 'STARTED' && player && player.position !== undefined) {
            setTimeout(() => {
                setPlayerPlaying(player.position!);
            }, PawnTransitionDuration);
        }
    }, [game, gameParams.gameId, props.player]);

    const refresh = useCallback(async () => {
        clearTimeout(Number(timer.current));

        if (isUnmounted.current) {
            return;
        }

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

    // Init board and set timer
    useEffect(() => {
        (async () => {
            try {
                const pawns = await game.initBoard(gameParams.gameId).catch((err) => {
                    throw err;
                });

                setPawns({
                    pawns,
                    hash: JSON.stringify(pawns)
                });
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
        })();

        return () => {
            isUnmounted.current = true;
            clearTimeout(Number(timer.current));
        };
    }, [refresh, game, gameParams.gameId]);

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
        currentPlayerPosition={props.currentPlayerPosition}
    />;
};
export default Board;