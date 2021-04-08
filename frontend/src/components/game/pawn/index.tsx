import { useState } from 'react';
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
    const defaultPosition = props.r + 1;
    const dimension = (defaultPosition * 2);

    const [position, setPosition] = useState({
        x: props.x || defaultPosition,
        y: props.y || defaultPosition,
        active: false,
        offset: {
            x: 0,
            y: 0
        }
    });

    const onPointerDown = (event: React.PointerEvent<SVGCircleElement>) => {
        if (!props.canMove) {
            return;
        }
        const element = event.currentTarget;
        const bbox = element.getBoundingClientRect();
        element.setPointerCapture(event.pointerId);
        setPosition({
            ...position,
            active: true,
            offset: {
                x: event.clientX - bbox.left,
                y: event.clientY - bbox.top
            }
        });

        event.preventDefault();
    };

    const onPointerUp = (event: React.PointerEvent<SVGCircleElement>) => {
        setPosition({
            ...position,
            active: false
        });
        event.preventDefault();
    };

    const onPointerMove = (event: React.PointerEvent<SVGCircleElement>) => {
        const bbox = event.currentTarget.getBoundingClientRect();
        if (position.active) {
            setPosition({
                ...position,
                x: position.x - (position.offset.x - (event.clientX - bbox.left)),
                y: position.y - (position.offset.y - (event.clientY - bbox.top))
            });
        }
        event.preventDefault();
    };


    const renderPawn = () => {
        return <circle
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            className={`pawn ${Colour[props.colour].toLowerCase()}`}
            id={props.id}
            cx={position.x}
            cy={position.y}
            r={props.r}
        />;
    };

    return props.alone ? <svg width={dimension} height={dimension}>{renderPawn()}</svg> : renderPawn();
};

export default Pawn;