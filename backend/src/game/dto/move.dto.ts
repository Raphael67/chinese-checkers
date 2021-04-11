import { ApiResponseProperty } from '@nestjs/swagger';
import { Cell } from '../board';
import { Move } from '../move.entity';

export class MoveDto {
    constructor(move: Move) {
        this.path = move.path;
    }

    @ApiResponseProperty({
        type: [Cell],
    })
    public path: Cell[];
}