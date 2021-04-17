import { Module } from '@nestjs/common';
import { PlayerCacheRepository } from './player-cache.repository';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

@Module({
    imports: [
        /* MongooseModule.forFeature([
            {
                name: Player.name,
                schema: PlayerSchema,
            },
        ]),*/
    ],
    controllers: [PlayerController],
    providers: [
        PlayerService,
        PlayerCacheRepository,
    ],
    exports: [PlayerService],
})
export class PlayerModule { }
