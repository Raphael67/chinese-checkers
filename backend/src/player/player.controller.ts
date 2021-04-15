import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerDto } from './dto/player.dto';
import { PlayerService } from './player.service';

@Controller('/api/player')
@ApiTags('Player')
export class PlayerController {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;


    @Get('/')
    @ApiOperation({
        summary: 'Return a list of players ordered by ratings',
    })
    @ApiResponse({
        status: 201,
        description: 'List of players',
        type: [PlayerDto],
    })
    public async getPlayers(): Promise<PlayerDto[]> {
        const players = await this.playerService.findByRating();
        return players.map((player) => {
            return new PlayerDto(player);
        });
    }
}
