import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cell, Coords } from './board';
import { BoardService } from './board.service';
import { MoveDto } from './dto/move.dto';
import { DatabaseGameRepository } from './game-database.repository';
import { GameStatus } from './game.class';
import { GameService } from './game.service';

@Controller('/api/board')
@ApiTags('Board')
export class BoardController {
    @Get('/:gameId')
    @ApiOperation({ summary: 'Return all pawns position for a game' })
    @ApiResponse({ status: 200, description: 'List of cells containing pawn', type: [Cell] })
    public async getBoard(@Param('gameId') gameId: string): Promise<Cell[]> {
        const game = await this.gameService.loadGame(gameId);
        if (!game) throw new NotFoundException(`Game not found : ${gameId}`);
        return game.board.getCells();
    }

    @Get('/:gameId/move')
    @ApiOperation({ summary: 'Return a list of all moves for a game to replay' })
    @ApiResponse({ status: 200, description: 'List of all moves. A move is an array of Cell.', type: [MoveDto] })
    public async move(@Param('gameId') gameId: string): Promise<MoveDto[]> {
        const gameEntity = await this.databaseGameRepository.findOne(gameId);
        return gameEntity.moves;
    }

    @Post('/:gameId/player/:playerIndex/move')
    @ApiOperation({ summary: 'Add a move for a player to a game' })
    @ApiResponse({ status: 403, description: 'BadRequest with details in message property' })
    @ApiResponse({ status: 200, description: 'Move successfuly played' })
    public async addMove(
        @Body() path: Coords[],
        @Param('gameId') gameId: string,
        @Param('playerIndex', new ParseIntPipe()) playerIndex: number,
    ): Promise<void> {
        const game = await this.gameService.loadGame(gameId);
        if (game.status !== GameStatus.STARTED) throw new BadRequestException('Game is not started');
        /* try {
            this.boardService.isValidMove(game.board, path);
        } catch (ex) {
            throw new BadRequestException(ex.message);
        }
        this.boardService.playMove(cachedGame.board, path);
        await this.boardService.saveMove(cachedGame.game, path);*/

        return;
    }

    @Inject(BoardService)
    private readonly boardService: BoardService;

    @Inject(DatabaseGameRepository)
    private readonly databaseGameRepository: DatabaseGameRepository;

    @Inject(GameService)
    private readonly gameService: GameService;
}
