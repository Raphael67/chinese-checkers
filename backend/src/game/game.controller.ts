import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Inject, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerEntity } from '../player/player.entity';
import { PlayerRepository } from '../player/player.repository';
import { PlayerService } from '../player/player.service';
import { GameDetailsDto } from './dto/game-details.dto';
import { GamePlayerDto } from './dto/game-player.dto';
import { DatabaseGameRepository } from './game-database.repository';
import { GameStatus } from './game.class';
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
        @Query('player') player?: string,
        @Query('date') date?: string,
        @Query('orderBy') orderBy: 'createdAt' | 'rounds' = 'createdAt'
    ): Promise<GameDetailsDto[]> {
        const gameEntities = await this.databaseGameRepository.find({
            where: {
                status: GameStatus.FINISHED + 1,
            },
            order: { [orderBy]: 'DESC' },
            relations: ['gamePlayers', 'creator'],
        });
        const games = gameEntities.map((gameEntity) => DatabaseGameRepository.fromEntityToGame(gameEntity));
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
        const game = this.gameService.createGame();
        return new GameDetailsDto(game);
    }

    @Patch('/:gameId/start')
    @ApiOperation({ summary: 'Start a game' })
    @ApiResponse({ status: 201, description: 'Game has been successfuly started' })
    public async startGame(@Param('gameId') gameId: string): Promise<void> {
        const game = await this.gameService.loadGame(gameId);
        if (game.status !== GameStatus.CREATED) throw new BadRequestException(`Game can not be start as it is in status: ${game.status}`);
        await this.gameService.startGame(game);
    }

    @Patch('/:gameId/stop')
    @ApiOperation({ summary: 'Stop a game' })
    @ApiResponse({ status: 201, description: 'Game has been successfuly stopped' })
    public async stopGame(@Param('gameId') gameId: string): Promise<void> {
        const game = await this.gameService.loadGame(gameId);
        if (game.status !== GameStatus.STARTED) throw new BadRequestException(`Game can not be stopped as it is in status: ${game.status}`);
        game.status = GameStatus.FINISHED;
        game.winner = game.getCurrentPlayer();
        await this.databaseGameRepository.saveFinished(game);
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
        this.gameService.addPlayerToGame(game, player, gamePlayerDto.position);
    }

    @Inject(GameService)
    private readonly gameService: GameService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(DatabaseGameRepository)
    private readonly databaseGameRepository: DatabaseGameRepository;

    @InjectRepository(PlayerEntity)
    private readonly playerRepository: PlayerRepository;

}
