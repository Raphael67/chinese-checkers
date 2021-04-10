import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerService } from './player.service';

@Controller('/api/player')
@ApiTags('Player')
export class PlayerController {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;


    @Get('/')
    @ApiOperation({
        summary: 'Return a list of players orederd by ratings',
    })
    public getPlayers() {
        return this.playerService.findByRating();
    }
}
