import { Cell } from '../board';
import { CoordsDto } from './coords.dto';

export class CellDto {
    public static from(cell: Cell): CellDto {
        const dto = new CellDto();
        dto.coords = CoordsDto.from(cell.coords);
        dto.pawn = cell.getPawn();
        return dto;
    }
    public coords: CoordsDto;
    public pawn: number;
}