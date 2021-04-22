import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { BotService } from './bot.service';

@Module({
    imports: [
        GameModule,
    ],
    providers: [
        BotService,
    ],
})
export class BotModule { }
