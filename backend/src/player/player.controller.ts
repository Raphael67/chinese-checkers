import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlayerService } from './player.service';

@Controller('player')
@ApiTags('Player')
export class PlayerController {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;


    @Get('/')
    public getPlayers() {
        return this.playerService.findByRating();
    }
}
