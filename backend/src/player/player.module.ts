import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { Player } from './player.entity';
import { PlayerService } from './player.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Player
        ])
    ],
    controllers: [PlayerController],
    providers: [PlayerService],
    exports: [PlayerService]
})
export class PlayerModule { }
