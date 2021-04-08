import React, { useContext } from 'react';
import { AppContext } from '../../..';
import { Colour } from '../board';
import './index.less';

interface IProps {
    colour: Colour;
    id?: string;
    x?: number;
    y?: number;
    r: number;
    alone?: boolean;
    canMove?: boolean;
}

const Pawn = (props: IProps) => {
    const { game } = useContext(AppContext);

    const defaultPosition = props.r + 1;
    const dimension = (defaultPosition * 2);

    const clickPawn = (event: React.MouseEvent<SVGGeometryElement>) => {
        game.takePawn(event.currentTarget.id);
    };

    const renderPawn = () => {
        return <circle
            onClick={clickPawn}
            className={`pawn ${Colour[props.colour].toLowerCase()}`}
            id={props.id}
            cx={props.x || defaultPosition}
            cy={props.y || defaultPosition}
            r={props.r}
        />;
    };

    return props.alone ? <svg width={dimension} height={dimension}>{renderPawn()}</svg> : renderPawn();
};

export default Pawn;