import { IsNumber } from 'class-validator';
import { Coords } from '../board';

export class CoordsDto {
    @IsNumber()
    public x: number;
    @IsNumber()
    public y: number;

    public static from(coords: Coords): CoordsDto {
        const dto = new CoordsDto();
        dto.x = coords.x;
        dto.y = coords.y;
        return dto;
    }

    public toCoords(): Coords {
        return new Coords(this.x, this.y);
    }
}