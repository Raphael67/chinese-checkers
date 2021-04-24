import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../player/player.service';
import { GameDetailsDto } from './dto/game-details.dto';
import { GamePlayerDto } from './dto/game-player.dto';
import { GameService } from './game.service';

@Controller('/api/game')
@ApiTags('Game')
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
    @Get('/')
    @ApiOperation({ summary: 'Return a list of finished games for replay' })
    @ApiQuery({ name: 'player', required: false })
    @ApiQuery({ name: 'date', required: false, type: Date })
    @ApiQuery({ name: 'orderBy', enum: ['createdAt', 'rounds'] })
    @ApiResponse({ status: 200, description: 'Lise of games', type: [GameDetailsDto] })
    public async getGames(
        @Query('player') nickname?: string,
        @Query('date') date?: Date,
        @Query('orderBy') orderBy: 'createdAt' | 'rounds' = 'createdAt'
    ): Promise<GameDetailsDto[]> {
        const games = await this.gameService.findFinishedGames();
        return games.map((game) => new GameDetailsDto(game));
    }

    @Get('/:gameId')
    @ApiOperation({ summary: 'Return a game and its players' })
    public async getGame(@Param('gameId') gameId: string): Promise<GameDetailsDto> {
        const game = await this.gameService.loadGame(gameId);
        return new GameDetailsDto(game);
    }

    @Post('/')
    @ApiOperation({ summary: 'Create a new game and return its id' })
    public async createGame(): Promise<GameDetailsDto> {
        const game = await this.gameService.createGame();
        return new GameDetailsDto(game);
    }

    @Patch('/:gameId/start')
    @ApiOperation({ summary: 'Start a game' })
    @ApiResponse({ status: 201, description: 'Game has been successfuly started' })
    public async startGame(@Param('gameId') gameId: string): Promise<void> {
        const game = await this.gameService.loadGame(gameId);
        await this.gameService.startGame(game);
    }

    @Post('/:gameId/player')
    @ApiOperation({ summary: 'Add a new player to the game and create the player if necessary' })
    @ApiResponse({ status: 403, description: 'An object with a message property describing the error' })
    @ApiResponse({ status: 201, description: 'Player has been successfuly linked to the game' })
    public async upsertPlayerToGame(
        @Param('gameId') gameId: string,
        @Body() gamePlayerDto: GamePlayerDto,
    ): Promise<void> {
        const game = await this.gameService.loadGame(gameId);
        const player = await this.playerService.upsertPlayer(gamePlayerDto.nickname);
        await this.gameService.addPlayerToGame(game, player, gamePlayerDto.position);
    }

    @Inject(GameService)
    private readonly gameService!: GameService;

    @Inject(PlayerService)
    private readonly playerService!: PlayerService;
}
