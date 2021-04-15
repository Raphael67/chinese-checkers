import { Cell } from '../board';
import { CoordsDto } from './coords.dto';

export class CellDto {
    public constructor(cell: Cell) {
        this.coords = cell.coords;
        this.pawn = cell.getPawn();
    }
    public readonly coords: CoordsDto;
    public readonly pawn: number;
}