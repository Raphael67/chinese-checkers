import { BadRequestException, Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, Inject, Patch, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../player/player.service';
import { GameDetailsDto } from './dto/game-details.dto';
import { GamePlayerDto } from './dto/game-player.dto';
import { Game, GameStatus } from './game.entity';
import { GameGuard, RequestWithGame } from './game.guard';
import { GameService } from './game.service';

@Controller('/api/game')
@ApiTags('Game')
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
    @Inject(GameService)
    private readonly gameService: GameService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Get('/')
    @ApiOperation({ summary: 'Return a list of finished games for replay' })
    @ApiQuery({ name: 'player', required: false })
    @ApiQuery({ name: 'date', required: false, type: Date })
    @ApiQuery({ name: 'orderBy', enum: ['createdAt', 'rounds'] })
    @ApiResponse({ status: 200, description: 'Lise of games', type: [GameDetailsDto] })
    public async getGames(
        @Query('player') player?: string,
        @Query('date') date?: string,
        @Query('orderBy') orderBy: 'createdAt' | 'rounds' = 'createdAt'
    ): Promise<GameDetailsDto[]> {
        return this.gameService.listGames(player, date ? new Date(date) : undefined, orderBy);
    }

    @Get('/:gameId')
    @ApiOperation({ summary: 'Return a game and its players' })
    @ApiParam({ name: 'gameId', type: String })
    @ApiResponse({ status: 200, description: 'Game with players', type: GameDetailsDto })
    @UseGuards(GameGuard)
    public async getGame(@Request() request: RequestWithGame): Promise<GameDetailsDto> {
        return new GameDetailsDto(request.game);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a new game and return its id' })
    @ApiResponse({ status: 201, description: 'Return the new created game', type: Game })
    public async createGame(): Promise<Game> {
        return await this.gameService.createGame();
    }

    @Patch('/:gameId')
    @ApiOperation({ summary: 'Start a game' })
    @ApiParam({ name: 'gameId', type: String })
    @ApiBody({ schema: { example: { status: GameStatus.IN_PROGRESS } } })
    @ApiResponse({ status: 201, description: 'Game has been successfuly started' })
    @UseGuards(GameGuard)
    public async startGame(@Body('status') status: GameStatus, @Request() request: RequestWithGame): Promise<void> {
        if (status !== GameStatus.IN_PROGRESS) throw new BadRequestException('Accepted status is ' + GameStatus.IN_PROGRESS);
        await this.gameService.start(request.game);
    }

    @Post('/:gameId/player')
    @ApiOperation({ summary: 'Add a new player to the game and create the player if necessary' })
    @ApiParam({ name: 'gameId', type: String })
    @ApiBody({ type: GamePlayerDto, required: true, schema: { example: { nickname: 'Test', color: 'RED' } } })
    @ApiResponse({ status: 403, description: 'An object with a message property describing the error' })
    @ApiResponse({ status: 201, description: 'Player has been successfuly linked to the game' })
    @UseGuards(GameGuard)
    public async upsertPlayerToGame(
        @Body() gamePlayerDto: GamePlayerDto,
        @Request() request: RequestWithGame,
    ): Promise<void> {
        const game = request.game;
        if (!this.gameService.isPositionAvailable(game, gamePlayerDto.position)) {
            throw new ForbiddenException('This color is already taken in this game');
        }
        if (!this.gameService.isNicknameAvailable(game, gamePlayerDto.nickname)) {
            throw new ForbiddenException('This nickname is already taken in this game');
        }

        let player = await this.playerService.findOneByNickname(gamePlayerDto.nickname);
        if (!player) {
            player = await this.playerService.createPlayer(gamePlayerDto.nickname);
        }
        await this.gameService.linkPlayerToGame(game, player, gamePlayerDto.position);
    }

}
