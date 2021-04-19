import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { BotModule } from './bot/bot.module';
import { EventsModule } from './events/events.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
        }),
        GameModule,
        PlayerModule,
        BoardModule,
        EventsModule,
        BotModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
