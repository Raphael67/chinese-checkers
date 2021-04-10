import { BadRequestException, Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GameGuard, RequestWithGame } from '../game/game.guard';
import { MoveService } from './move.service';

@Controller('/api/board')
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
        name: 'gameId',
        type: String,
    })
    @ApiParam({
        name: 'playerIndex',
        type: Number,
    })
    @UseGuards(GameGuard)
    @ApiOperation({
        summary: 'Add a move for a player to a game',
    })
    public async addMove(
        @Body() path: number[][],
        @Param('playerIndex', new ParseIntPipe()) playerIndex: number,
        @Request() request: RequestWithGame,
    ): Promise<boolean> {
        const board = await this.moveService.getBoard(request.game);
        try {
            this.moveService.isValidPath(board, playerIndex, path);
        } catch (ex) {
            throw new BadRequestException(ex.message);
        }
        this.moveService.playPath(board, path);
        this.moveService.saveMove(request.game, path);
        return true;
    }
}
