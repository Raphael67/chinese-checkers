import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';
import { GameController } from './game.controller';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Game,
            Player
        ])
    ],
    controllers: [GameController],
    providers: [GameService]
})
export class GameModule { }
