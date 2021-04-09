import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GameGuard } from '../game/game.guard';
import { Board, Cell } from './board';

@Controller('board')
@ApiTags('Board')
export class BoardController {
    @Get('/:gameId')
    @ApiParam({
        name: 'gameId',
        type: String
    })
    @UseGuards(GameGuard)
    @ApiOperation({
        summary: 'Return all pawns position for a game',
    })
    public async getBoard(@Request() request: Request): Promise<Cell[]> {
        const board = new Board();
        return board.getCells();
    }
}
