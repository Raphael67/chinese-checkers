import { Coords } from '../board';

export class CoordsDto {
    public readonly x: number;
    public readonly y: number;

    public constructor(coords: Coords) {
        this.x = coords.x;
        this.y = coords.y;
    }

    public toCoords(): Coords {
        return new Coords(this.x, this.y);
    }
}