import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class Coords {
    public x: number;
    public y: number;
    public constructor(
        x: number,
        y: number,
    ) {
        this.x = x;
        this.y = y;
    }

    public static dist(v1: Coords, v2: Coords): number {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    }

    public toString(): string {
        return `{${this.x}, ${this.y}}`;
    }
}

export class Cell {
    @ApiProperty()
    @ApiResponseProperty()
    private pawn?: number;
    @ApiProperty()
    @ApiResponseProperty()
    public coords: Coords;

    public constructor(
        coords: Coords,
    ) {
        this.coords = coords;
    }

    public getIndex(): string {
        return this.coords.x + '-' + this.coords.y;
    }

    public setPawn(player?: number): void {
        this.pawn = player;
    }

    public getPawn(): number {
        return this.pawn;
    }
}

const holes = [1, 2, 3, 4, 13, 12, 11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1];

export const playerPositions = [
    ['12-0', '11-1', '13-1', '10-2', '12-2', '14-2', '9-3', '11-3', '13-3', '15-3'],
    ['24-4', '18-4', '20-4', '22-4', '19-5', '21-5', '23-5', '20-6', '22-6', '21-7'],
    ['24-12', '18-12', '20-12', '22-12', '19-11', '21-11', '23-11', '20-10', '22-10', '21-9'],
    ['12-16', '11-15', '13-15', '10-14', '12-14', '14-14', '9-13', '11-13', '13-13', '15-13'],
    ['0-12', '2-12', '4-12', '6-12', '1-11', '3-11', '5-11', '2-10', '4-10', '3-9'],
    ['0-4', '2-4', '4-4', '6-4', '1-5', '3-5', '5-5', '2-6', '4-6', '3-7'],
];
export class Board {
    private cells: Map<string, Cell> = new Map();

    public constructor() {
        for (let row = 0; row < 17; row++) {
            let column = Math.ceil(25 / 2) - Math.floor(holes[row]);
            for (let hole = 0; hole < holes[row]; hole++) {
                const cell = new Cell(new Coords(column, row));
                this.cells.set(cell.getIndex(), cell);
                column += 2;
            }
        }
        let playerIndex = 0;
        for (const player of playerPositions) {
            for (const pawn of player) {
                const cell = this.cells.get(pawn);
                cell.setPawn(playerIndex);
            }
            playerIndex++;
        }
    }

    public isWinner(player: number): boolean {
        const opponent = (player + 3) % 6;
        for (const position of playerPositions[opponent]) {
            if (this.cells.get(position).getPawn() !== player) return false;
        }
        return true;
    }

    public getCells(): Cell[] {
        const cells = [];
        this.cells.forEach(cell => cells.push(cell));
        return cells;
    }

    public getCell(coords: Coords | string): Cell {
        if (coords instanceof Coords) {
            const cell = new Cell(coords);
            return this.cells.get(cell.getIndex());
        } else {
            return this.cells.get(coords);
        }
    }

    public print(): void {
        console.log('------------------------------------------------');
        for (let y = 0; y < 17; y++) {
            let row = '';
            for (let x = 0; x < 25; x++) {
                const cell = this.getCell(new Coords(x, y));
                if (!cell) row += ' ';
                else row += cell.getPawn() === undefined ? '.' : cell.getPawn();
            }
            console.log(row);
        }
        console.log('------------------------------------------------');
    }
}