import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerCacheRepository } from './player-cache.repository';
import { PlayerRepository } from './player-mogoose.repository';
import { PlayerController } from './player.controller';
import { PlayerEntity, PlayerSchema } from './player.entity';
import { PlayerService } from './player.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: PlayerEntity.name,
                schema: PlayerSchema,
            },
        ]),
    ],
    controllers: [PlayerController],
    providers: [
        PlayerService,
        PlayerCacheRepository,
        PlayerRepository,
    ],
    exports: [
        PlayerService,
        PlayerRepository,
    ],
})
export class PlayerModule { }
