import { BadRequestException, Body, Controller, Get, Inject, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { CellDto } from './dto/cell.dto';
import { CoordsDto } from './dto/coords.dto';
import { DatabaseGameRepository } from './game-database.repository';
import { GameStatus } from './game.class';
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
    @ApiOkResponse({ type: [CoordsDto] })
    @ApiOperation({ summary: 'Return a list of all moves for a game to replay' })
    public async move(@Param('gameId') gameId: string): Promise<CoordsDto[][]> {
        const gameEntity = await this.databaseGameRepository.findOne(gameId, {
            where: { status: GameStatus.FINISHED },
        });
        if (!gameEntity) throw new NotFoundException(`Can not find finished game ${gameId}`);
        return gameEntity.moves.map((move) => move.path);
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
        if (game.getCurrentPlayer() !== playerIndex) throw new BadRequestException('Not this player turn');
        try {
            this.boardService.isValidMove(game, moveDto);
        } catch (ex) {
            throw new BadRequestException(ex.message);
        }
        this.gameService.playMove(game, moveDto);
        await this.boardService.saveMove(game, moveDto);
    }

    @Inject(BoardService)
    private readonly boardService: BoardService;

    @Inject(DatabaseGameRepository)
    private readonly databaseGameRepository: DatabaseGameRepository;

    @Inject(GameService)
    private readonly gameService: GameService;
}
