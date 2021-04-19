import { Colour } from 'core/board';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../..';
import './index.less';

enum State {
    Idle,
    Moving
}

const stateClasses = {
    [State.Idle]: 'idle',
    [State.Moving]: 'moving'
};

interface IProps {
    colour: Colour;
    id?: string;
    x?: number;
    y?: number;
    r: number;
    alone?: boolean;
    canMove?: boolean;
    setZIndexBoardUse?: (id: string) => void;
}

const Pawn = (props: IProps) => {
    const { game } = useContext(AppContext);
    const ref = useRef<SVGCircleElement>(null);
    const [state, setState] = useState<State>(State.Idle);

    const defaultPosition = props.r + 1;
    const dimension = (defaultPosition * 2);

    const setZIndexBoardUse = props.setZIndexBoardUse;

    useEffect(() => {
        const element = ref.current;
        if (element) {
            element.addEventListener('transitionstart', () => {
                setZIndexBoardUse && setZIndexBoardUse(element.id);
                setState(State.Moving);
            });

            element.addEventListener('transitionend', () => {
                setState(State.Idle);
            });
        }
    }, [setZIndexBoardUse]);

    const clickPawn = (event: React.MouseEvent<SVGGeometryElement>) => {
        if (props.canMove) {
            game.takePawn(event.currentTarget.id);
        }
    };

    const renderPawn = () => {
        return <circle
            onClick={clickPawn}
            className={`pawn ${Colour[props.colour].toLowerCase()} ${props.canMove ? 'pointer' : ''} ${stateClasses[state]}`}
            ref={ref}
            id={props.id}
            cx={props.x || defaultPosition}
            cy={props.y || defaultPosition}
            r={props.r}
        />;
    };

    return props.alone ? <svg width={dimension} height={dimension}>{renderPawn()}</svg> : renderPawn();
};

export default Pawn;