import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GameDetailsDto } from './dto/game-details.dto';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Controller('game')
@ApiTags('Game')
export class GameController {
    @Inject(GameService)
    private readonly gameService: GameService;

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
        required: false,
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
    public async createGame(): Promise<Game> {
        return this.gameService.createGame();
    }

}
