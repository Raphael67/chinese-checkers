import { ReactElement } from 'react';
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

const Board = (): ReactElement => <BoardComponent canMove={{
    [Colour.Black]: true,
    [Colour.Blue]: true,
    [Colour.Purple]: true,
    [Colour.Yellow]: true,
    [Colour.Green]: false,
    [Colour.Red]: true,
}} />;
export default Board;