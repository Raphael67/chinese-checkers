import { Colour } from 'core/board';
import { ReactElement, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppState } from 'redux/reducers';
import { AppContext } from '../../..';
import BoardComponent from './component';
import './index.less';

const Board = (): ReactElement => {
    const { game } = useContext(AppContext);
    const timer = useRef<NodeJS.Timeout>();
    const gameParams = useParams<IGameParams>();

    const mapStateToObj = useSelector((state: AppState) => {
        const { possiblePlaces, pawnPlace, path } = state.game;
        const { player } = state.session;
        return {
            possiblePlaces: { possiblePlaces, hash: JSON.stringify(possiblePlaces) },
            pawnPlace,
            path: { path, hash: JSON.stringify(path) },
            player
        };
    });

    useEffect(() => {
        (async () => {
            clearInterval(Number(timer.current));
            timer.current = setInterval(async () => {
                await game.getBoard(gameParams.gameId).catch((err) => {
                    console.error(err);
                });
            }, 2000);
        })();

        return () => {
            clearInterval(Number(timer.current));
        };
    }, [game, gameParams.gameId]);

    const clickPlace = (place: string) => {
        game.clickPlace(place);
    };

    const doubleClickPlace = (place: string) => {
        game.doubleClickPlace(place);
    };

    return <BoardComponent
        canMove={{ [mapStateToObj.player?.colour || Colour.Black]: true }}
        placesHighlighted={mapStateToObj.possiblePlaces}
        pawnPlace={mapStateToObj.pawnPlace}
        path={mapStateToObj.path}
        clickPlace={clickPlace}
        doubleClickPlace={doubleClickPlace}
    />;
};
export default Board;