import { Controller, Get, Inject, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cell } from './board';
import { GameGuard, RequestWithGame } from './game.guard';
import { MoveService } from './move.service';

@Controller('/api/board')
@ApiTags('Board')
export class BoardController {
    @Inject(MoveService)
    private readonly moveService: MoveService;

    @Get('/:gameId')
    @ApiParam({ name: 'gameId', type: String })
    @UseGuards(GameGuard)
    @ApiOperation({ summary: 'Return all pawns position for a game' })
    @ApiResponse({ status: 200, description: 'List of cells containing pawn', type: [Cell] })
    public async getBoard(@Request() request: RequestWithGame): Promise<Cell[]> {
        const board = request.game.board;
        return board.getCells();
    }
}
