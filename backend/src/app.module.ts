import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { ConfigModule } from './config/config.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';

@Module({
    imports: [
        ConfigModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
        }),
        // MongooseModule.forRoot('mongodb://localhost:27017/chinese-checkers'),
        GameModule,
        PlayerModule,
        BoardModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
