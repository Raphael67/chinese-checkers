import { Body, Controller, Get, Inject, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GameGuard, RequestWithGame } from '../game/game.guard';
import { MoveService } from './move.service';

@Controller('board')
@ApiTags('Board')
export class MoveController {
    @Inject(MoveService)
    private readonly moveService: MoveService;

    @Get('/:gameId/move')
    @ApiParam({
        name: 'gameId',
        type: String
    })
    @UseGuards(GameGuard)
    @ApiOperation({
        summary: 'Return a list of all moves for a game to replay',
    })
    public async move(
        @Request() request: RequestWithGame
    ): Promise<number[][][]> {
        const moves = await this.moveService.findByGame(request.game);
        return moves.map((move) => move.path);
    }

    @Post('/:gameId/player/:playerIndex/move')
    @ApiParam({
        name: 'playerIndex',
        type: Number,
    })
    @UseGuards(GameGuard)
    @ApiOperation({
        summary: 'Add a move for a player to a game',
    })
    public async addMove(
        @Body() move: number[][],
        @Param() playerIndex: number,
        @Request() request: RequestWithGame,
    ): Promise<boolean> {
        const board = await this.moveService.getBoard(request.game);
        return this.moveService.isValidPath(board, playerIndex, move);
    }
}
