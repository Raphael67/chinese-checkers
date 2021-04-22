import { Colour } from 'core/board';
import * as d3 from 'd3';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../..';
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

    const { game } = useContext(AppContext);
    const ref = useRef<SVGCircleElement>(null);
    const [position] = useState<IPosition>({
        x: props.x || defaultPosition,
        y: props.y || defaultPosition
    });
    const [canMove, setCanMove] = useState<boolean>(props.canMove || false);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            const d3Element = d3.select(element);

            if (props.x && props.y) {
                setCanMove(false);

                d3Element
                    .raise()
                    .attr('r', props.r || 16)
                    .transition()
                    .duration(1000)
                    .attr('cx', (Number(d3Element.attr('cx')) + (props.x || defaultPosition)) / 2)
                    .attr('cy', (Number(d3Element.attr('cy')) + (props.y || defaultPosition)) / 2)
                    .attr('r', 25)
                    .transition()
                    .duration(1000)
                    .attr('cx', props.x || defaultPosition)
                    .attr('cy', props.y || defaultPosition)
                    .attr('r', props.r || 16)
                    .on('end', () => setCanMove(props.canMove || false));
            }


        }
    }, [props.x, props.y, props.r, props.canMove, defaultPosition]);

    const clickPawn = (event: React.MouseEvent<SVGGeometryElement>) => {
        if (canMove) {
            game.takePawn(event.currentTarget.id);
        }
    };

    const renderPawn = () => {
        const { x, y } = position;
        return <circle
            onClick={clickPawn}
            className={`pawn ${Colour[props.colour].toLowerCase()} ${canMove ? 'pointer' : ''} `}
            ref={ref}
            id={props.id}
            cx={x || defaultPosition}
            cy={y || defaultPosition}
            r={props.r}
        />;
    };

    return props.alone ? <svg width={dimension} height={dimension}>{renderPawn()}</svg> : renderPawn();
};

export default Pawn;