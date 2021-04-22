import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { BotModule } from './bot/bot.module';
import { default as mongodbConfig } from './config/mongodb.configuration';
import { EventsModule } from './events/events.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [mongodbConfig],
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            useFactory: (config: ConfigType<typeof mongodbConfig>) => {
                return {
                    uri: `mongodb://${config.host}:${config.port}/chinese-checkers`,
                    useFindAndModify: false,
                };
            },
            inject: [mongodbConfig.KEY],
        }),
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
