import { Body, Controller, Get, Inject, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { GameGuard, RequestWithGame } from '../game/game.guard';
import { IMoves } from '../game/move.entity';
import { MoveService } from './move.service';

@Controller()
export class MoveController {
    @Inject(MoveService)
    private readonly moveService: MoveService;

    @Get('/game/:gameId/move')
    @ApiParam({
        name: 'gameId',
        type: String
    })
    @UseGuards(GameGuard)
    public async move(
        @Request() request: RequestWithGame
    ): Promise<IMoves[]> {
        const moves = await this.moveService.findByGame(request.game);
        return moves.map((move) => move.moves);
    }

    @Post('/game/:gameId/player/:playerIndex/move')
    @ApiParam({
        name: 'playerIndex',
        type: Number,
    })
    @UseGuards(GameGuard)
    public async addMove(
        @Body() move: number[][],
        @Param() playerIndex: number,
        @Request() request: RequestWithGame,
    ): Promise<boolean> {
        const board = await this.moveService.getBoard(request.game);
        return this.moveService.isValidPath(board, playerIndex, move);
    }
}
