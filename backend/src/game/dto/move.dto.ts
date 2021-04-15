import { ApiResponseProperty } from '@nestjs/swagger';
import { Coords } from '../board';
import { Move } from '../move.entity';

export class MoveDto {
    public constructor(move: Move) {
        this.path = move.path;
    }

    @ApiResponseProperty({
        type: [Coords],
    })
    public path: Coords[];
}