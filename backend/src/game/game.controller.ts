import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, Inject, Param, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../player/player.service';
import { GameDetailsDto } from './dto/game-details.dto';
import { GamePlayerDto } from './dto/game-player.dto';
import { Game } from './game.entity';
import { GameGuard, RequestWithGame } from './game.guard';
import { GameService } from './game.service';

@Controller('game')
@ApiTags('Game')
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
    @Inject(GameService)
    private readonly gameService: GameService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Get('/')
    @ApiQuery({
        name: 'player',
        required: false
    })
    @ApiQuery({
        name: 'date',
        required: false,
        type: Date
    })
    @ApiQuery({
        name: 'orderBy',
        enum: ['created_at', 'rounds']
    })
    @ApiOperation({
        summary: 'Return a list of finished games for replay',
    })
    public async getGames(
        @Query('player') player?: string,
        @Query('date') date?: string,
        @Query('orderBy') orderBy: 'created_at' | 'rounds' = 'created_at'
    ): Promise<GameDetailsDto[]> {
        return this.gameService.listGames(player, date ? new Date(date) : undefined, orderBy);
    }

    @Get('/:gameId')
    @ApiParam({
        name: 'gameId',
        type: String
    })
    @ApiOperation({
        summary: 'Return a game and its players',
    })
    public async getGame(@Param('gameId') gameId: string): Promise<Game> {
        return this.gameService.findOne(gameId);
    }

    @Post('/')
    @ApiOperation({
        summary: 'Create a new game and return its id',
    })
    public createGame(): Promise<Game> {
        return this.gameService.createGame();
    }

    @ApiParam({
        name: 'gameId',
        type: String
    })
    @ApiBody({
        type: GamePlayerDto,
        required: true,
        schema: {
            example: { nickname: 'Test', color: 'RED' }
        }
    })
    @Post('/:gameId/player')
    @UseGuards(GameGuard)
    @ApiOperation({
        summary: 'Add a new player to the game and create the player if necessary',
    })
    public async upsertPlayerToGame(
        @Body() gamePlayerDto: GamePlayerDto,
        @Request() request: RequestWithGame,
    ): Promise<void> {
        const game = request.game;
        if (!this.gameService.isColorAvailable(game, gamePlayerDto.color)) {
            throw new ForbiddenException('This color is already taken in this game');
        }
        if (!this.gameService.isNicknameAvailable(game, gamePlayerDto.nickname)) {
            throw new ForbiddenException('This nickname is already taken in this game');
        }

        let player = await this.playerService.findOneByNickname(gamePlayerDto.nickname);
        if (!player) {
            player = await this.playerService.createPlayer(gamePlayerDto.nickname);
        }
        this.gameService.linkPlayerToGame(game, player, gamePlayerDto.color);
    }

}
