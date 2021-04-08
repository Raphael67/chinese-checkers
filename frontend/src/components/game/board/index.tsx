import { ReactElement, useContext } from 'react';
import { useSelector } from 'react-redux';
import { AppContext } from '../../..';
import { AppState } from '../../../redux/reducers';
import BoardComponent from './component';
import './index.less';

export enum Colour {
    Black,
    Blue,
    Purple,
    Yellow,
    Green,
    Red
}

const Board = (): ReactElement => {
    const { game } = useContext(AppContext);

    const mapStateToObj = useSelector((state: AppState) => {
        const { possiblePlaces, pawnPlace, path } = state.game;
        return {
            possiblePlaces,
            pawnPlace,
            path
        };
    });

    const clickPlace = (place: string) => {
        game.clickPlace(place);
        //game.placePawn(place);
    };

    const doubleClickPlace = (place: string) => {
        game.doubleClickPlace(place);
    };

    return <BoardComponent canMove={{
        [Colour.Black]: true,
        [Colour.Blue]: true,
        [Colour.Purple]: true,
        [Colour.Yellow]: true,
        [Colour.Green]: false,
        [Colour.Red]: true,
    }} placesHighlighted={mapStateToObj.possiblePlaces} pawnPlace={mapStateToObj.pawnPlace} path={mapStateToObj.path} clickPlace={clickPlace} doubleClickPlace={doubleClickPlace} />;
};
export default Board;