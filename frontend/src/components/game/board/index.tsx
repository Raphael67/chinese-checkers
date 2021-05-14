import Game from 'core/game';
import { memo, ReactElement, useCallback, useContext, useEffect, useState } from 'react';
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
    currentPlayerPosition?: number;
    setPlayerPlaying: (position: number) => void;
}

let timer: NodeJS.Timeout;

async function refresh(game: Game, gameId: string, onPawnPlaced: () => void, setPlayerMovable: () => void) {
    setPlayerMovable();
    if ((await game.setMoves(gameId)).length > 0) {
        onPawnPlaced();
    }
    else {
        timer = setTimeout(async () => {
            await refresh(game, gameId, onPawnPlaced, setPlayerMovable);
        }, 2000);
    }
};

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
    const gameParams = useParams<IGameParams>();
    const [pawns, setPawns] = useState<IHashPawnPlaces>({
        pawns: [],
        hash: '',
    });
    const [currentPlayerPosition, setCurrentPlayerPosition] = useState<number | undefined>(props.currentPlayerPosition);
    const [canMove, setCanMove] = useState<boolean>(false);

    const setPlayerPlayingFromProps = props.setPlayerPlaying;
    const setPlayerPlaying = useCallback((position: number) => {
        setPlayerPlayingFromProps(position);
        setCurrentPlayerPosition(position);

    }, [setPlayerPlayingFromProps]);

    const setPlayerMovable = useCallback(() => {
        const playerPosition = game.getPlayerPosition();
        const player = mapStateToObj.player;
        if (player && playerPosition === player.position) {
            setCanMove(true);
        }
    }, [game, mapStateToObj.player]);

    const onPawnPlaced = useCallback(async () => {
        const nextMove = game.placeNextPawn();
        const pawns = game.getPawns();
        if (pawns) {
            setCanMove(false);
            setPawns({
                pawns,
                hash: JSON.stringify(pawns),
            });
        }
        if (!nextMove) {
            const playerPosition = game.getPlayerPosition();
            if (playerPosition !== undefined) {
                setPlayerPlaying(playerPosition);

            }
            await refresh(game, gameParams.gameId, onPawnPlaced, setPlayerMovable);
        }
        else {
            setPlayerPlaying(nextMove.pawn!.colour);
        }
    }, [game, gameParams.gameId, setPlayerPlaying, setPlayerMovable]);

    // Init board and set timer
    useEffect(() => {
        (async () => {
            try {
                const pawns = await game.initBoard(gameParams.gameId).catch((err) => {
                    throw err;
                });

                setPawns({
                    pawns,
                    hash: JSON.stringify(pawns),
                });

                const playerPosition = game.getPlayerPosition();
                if (playerPosition !== undefined) {
                    setPlayerPlaying(playerPosition);
                    setPlayerMovable();
                }

                await refresh(game, gameParams.gameId, onPawnPlaced, setPlayerMovable);
            }
            catch (err) {
                console.error(err);
            }
        })();

        return () => {
            clearTimeout(Number(timer));
        };
    }, [game, gameParams.gameId, onPawnPlaced, setPlayerPlaying, mapStateToObj.player, setPlayerMovable]);

    const clickPlace = (place: string) => {
        if (game.clickPlace(place)) {
            setCanMove(false);
        }
    };

    const doubleClickPlace = (place: string) => {
        if (game.doubleClickPlace(place)) {
            setCanMove(false);
        }
    };

    return <BoardComponent
        pawns={pawns}
        player={mapStateToObj.player}
        placesHighlighted={mapStateToObj.possiblePlaces}
        path={mapStateToObj.path}
        clickPlace={clickPlace}
        doubleClickPlace={doubleClickPlace}
        currentPlayerPosition={currentPlayerPosition}
        onPawnPlaced={onPawnPlaced}
        canMove={canMove}
    />;
};
export default memo(Board, (prevProps, nextProps) => {
    return prevProps.setPlayerPlaying !== nextProps.setPlayerPlaying;
});