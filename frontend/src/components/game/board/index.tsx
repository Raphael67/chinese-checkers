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

const Board = (): ReactElement => <BoardComponent />;
export default Board;