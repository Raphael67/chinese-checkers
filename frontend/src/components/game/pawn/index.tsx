import { Colour } from 'core/board';
import * as d3 from 'd3';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
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
    onPlaced?: () => void;
}

const PawnTransitionDurations = [400, 400];

const Pawn = (props: IProps) => {
    const defaultPosition = props.r + 1;
    const dimension = (defaultPosition * 2);

    const { game } = useContext(AppContext);
    const ref = useRef<SVGCircleElement>(null);
    const [position] = useState<IPosition>({
        x: props.x || defaultPosition,
        y: props.y || defaultPosition
    });
    const isInit = useRef<boolean>(false);

    const onPlaced = props.onPlaced;

    useEffect(() => {
        (async () => {
            const element = ref.current;
            if (element) {
                const d3Element = d3.select(element);

                if (props.x && props.y) {
                    await d3Element
                        .raise()
                        .attr('r', props.r || 16)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(PawnTransitionDurations[0])
                        .attr('cx', (Number(d3Element.attr('cx')) + (props.x || defaultPosition)) / 2)
                        .attr('cy', (Number(d3Element.attr('cy')) + (props.y || defaultPosition)) / 2)
                        .attr('r', 25)
                        .transition()
                        .ease(d3.easeLinear)
                        .duration(PawnTransitionDurations[1])
                        .attr('cx', props.x || defaultPosition)
                        .attr('cy', props.y || defaultPosition)
                        .attr('r', props.r || 16)
                        .end().catch((err) => {
                            console.log(err);
                        });

                    if (isInit.current) {
                        onPlaced && onPlaced();
                    }
                }

                isInit.current = true;
            }
        })();
    }, [props.x, props.y, props.r, props.colour, defaultPosition, onPlaced]);

    const clickPawn = (event: React.MouseEvent<SVGGeometryElement>) => {
        if (props.canMove) {
            game.takePawn(event.currentTarget.id);
        }
    };

    const renderPawn = () => {
        const { x, y } = position;
        return <circle
            onClick={clickPawn}
            className={`pawn ${Colour[props.colour].toLowerCase()} ${props.canMove ? 'pointer' : ''} `}
            ref={ref}
            id={props.id}
            cx={x || defaultPosition}
            cy={y || defaultPosition}
            r={props.r}
        />;
    };

    return props.alone ? <svg width={dimension} height={dimension}>{renderPawn()}</svg> : renderPawn();
};

export default memo(Pawn);