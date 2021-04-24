import { Module } from '@nestjs/common';
import { BoardModule } from '../board/board.module';
import { BotService } from './bot.service';

@Module({
    imports: [
        BoardModule,
    ],
    providers: [
        BotService,
    ],
})
export class BotModule { }
