import { BadRequestException, Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cell } from './board';
import { MoveDto } from './dto/move.dto';
import { GameStatus } from './game.entity';
import { GameGuard, RequestWithGame } from './game.guard';
import { GameService } from './game.service';
import { MoveService } from './move.service';

@Controller('/api/board')
@ApiTags('Board')
export class MoveController {
    @Inject(MoveService)
    private readonly moveService: MoveService;

    @Inject(GameService)
    private readonly gameService: GameService;

    @Get('/:gameId/move')
    @ApiParam({ name: 'gameId', type: String })
    @UseGuards(GameGuard)
    @ApiOperation({ summary: 'Return a list of all moves for a game to replay' })
    @ApiResponse({ status: 200, description: 'List of all moves. A move is an array of Cell.', type: [MoveDto] })
    public async move(
        @Request() request: RequestWithGame
    ): Promise<MoveDto[]> {
        const moves = await this.moveService.findByGame(request.game);
        return moves.map((move) => new MoveDto(move));
    }

    @Post('/:gameId/player/:playerIndex/move')
    @ApiParam({ name: 'gameId', type: String })
    @ApiParam({ name: 'playerIndex', type: Number })
    @ApiBody({ type: [Cell] })
    @UseGuards(GameGuard)
    @ApiOperation({ summary: 'Add a move for a player to a game' })
    @ApiResponse({ status: 403, description: 'BadRequest with details in message property' })
    @ApiResponse({ status: 200, description: 'Move successfuly played' })
    public async addMove(
        @Body() path: Cell[],
        @Param('playerIndex', new ParseIntPipe()) playerIndex: number,
        @Request() request: RequestWithGame,
    ): Promise<void> {
        if (request.game.status !== GameStatus.IN_PROGRESS) throw new BadRequestException('Game can not be started due to its current state: ' + request.game.status);
        try {
            this.moveService.isValidPath(request.game, playerIndex, path);
        } catch (ex) {
            throw new BadRequestException(ex.message);
        }
        await this.moveService.playPath(request.game, path);
        await this.moveService.saveMove(request.game, path);

        return;
    }
}
