import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';


@Module({
    imports: [GameModule],
    controllers: [BoardController],
    providers: [BoardService],
    exports: [BoardService],
})
export class BoardModule { }