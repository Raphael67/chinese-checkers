import { Colour } from '../board';
import './index.less';

interface IProps {
    colour: Colour;
    id?: string;
    x?: number;
    y?: number;
    r: number;
    alone?: boolean;
}

const Pawn = (props: IProps) => {
    const defaultPosition = props.r + 1;
    const renderPawn = () => {
        return <circle className={`pawn ${Colour[props.colour].toLowerCase()}`} id={props.id} cx={props.x || defaultPosition} cy={props.y || defaultPosition} r={props.r}></circle>;
    };
    const dimension = (defaultPosition * 2);
    return props.alone ? <svg width={dimension} height={dimension}>{renderPawn()}</svg> : renderPawn();
};

export default Pawn;