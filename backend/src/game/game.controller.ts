import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Inject, NotFoundException, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlayerService } from '../player/player.service';
import { GameDetailsDto } from './dto/game-details.dto';
import { GamePlayerDto } from './dto/game-player.dto';
import { Game } from './game.entity';
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
    public async getGames(
        @Query('player') player?: string,
        @Query('date') date?: string,
        @Query('orderBy') orderBy: 'created_at' | 'rounds' = 'created_at'
    ): Promise<GameDetailsDto[]> {
        return this.gameService.listGames(player, date ? new Date(date) : undefined, orderBy);
    }

    @Post('/')
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
    public async upsertPlayerToGame(@Param('gameId') gameId, @Body() gamePlayerDto: GamePlayerDto): Promise<Game> {
        const game = await this.gameService.findOne(gameId);
        if (!game) throw new NotFoundException(`Game does not exist`);
        if (game.gamePlayers.find((gamePlayer) => gamePlayer.color === gamePlayerDto.color)) {
            throw new BadRequestException('This color is already taken in this game');
        }
        if (game.players.find((p) => p.nickname === gamePlayerDto.nickname)) {
            throw new BadRequestException('This nickname is already taken in this game');
        }

        let player = await this.playerService.findOneByNickname(gamePlayerDto.nickname);
        if (!player) {
            player = await this.playerService.createPlayer(gamePlayerDto.nickname);
        }
        console.log(player);
        return this.gameService.linkPlayerToGame(game, player, gamePlayerDto.color);
    }

}
