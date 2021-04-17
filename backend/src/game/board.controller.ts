import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { CellDto } from './dto/cell.dto';
import { CoordsDto } from './dto/coords.dto';
import { CacheGameRepository } from './game-cache.repository';
import { GameStatus } from './game.entity';
import { GameService } from './game.service';

@Controller('/api/board')
@ApiTags('Board')
export class BoardController {
    @Get('/:gameId')
    @ApiOperation({ summary: 'Return all pawns position for a game' })
    public async getBoard(@Param('gameId') gameId: string): Promise<CellDto[]> {
        const game = await this.gameService.loadGame(gameId);
        if (!game) throw new NotFoundException(`Game not found : ${gameId}`);
        return game.board.getCells().filter((cell) => cell.getPawn() !== undefined).map(cell => new CellDto(cell));
    }

    @Get('/:gameId/move')
    @ApiOperation({ summary: 'Return a list of all moves for a game' })
    @ApiQuery({ name: 'offset', required: false, description: 'Starts at 0, return offset element included.' })
    @ApiOkResponse({ type: [CoordsDto] })
    public async getMoves(@Param('gameId') gameId: string, @Query('offset') offset?: number): Promise<CoordsDto[][]> {
        const game = this.cacheGameRepository.findOne(gameId);
        if (!game) {
            throw new NotFoundException(`Can not find game ${gameId}`);
        }
        return game.moves.slice(offset).map((move) => move.map((coords) => new CoordsDto(coords)));
    }

    @Post('/:gameId/player/:playerIndex/move')
    @ApiOperation({ summary: 'Add a move for a player to a game' })
    @ApiBody({ type: [CoordsDto] })
    @ApiResponse({ status: 403, description: 'BadRequest with details in message property' })
    @ApiResponse({ status: 201, description: 'Move successfuly played' })
    public async addMove(
        @Body() moveDto: CoordsDto[],
        @Param('gameId') gameId: string,
        @Param('playerIndex', new ParseIntPipe()) playerIndex: number,
    ): Promise<void> {
        const game = await this.gameService.loadGame(gameId);
        if (game.status !== GameStatus.STARTED) throw new BadRequestException('Game is not started');
        if (game.currentPlayer !== playerIndex) throw new BadRequestException('Not this player turn');
        try {
            this.boardService.isValidMove(game, moveDto);
        } catch (ex) {
            throw new BadRequestException(ex.message);
        }
        await this.gameService.playMove(game, moveDto);
    }

    @Inject(BoardService)
    private readonly boardService: BoardService;

    @Inject(CacheGameRepository)
    private readonly cacheGameRepository: CacheGameRepository;

    @Inject(GameService)
    private readonly gameService: GameService;
}
