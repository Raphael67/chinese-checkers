import { DatabaseModule } from '@corteks/nest-database';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { GameMoves } from './game/game-moves.entity';
import { GamePlayer } from './game/game-player.entity';
import { Game } from './game/game.entity';
import { GameModule } from './game/game.module';
import { Player } from './player/player.entity';
import { PlayerModule } from './player/player.module';

@Module({
    imports: [
        ConfigModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
        }),
        DatabaseModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    type: 'mariadb',
                    host: configService.getConfig().get('database').host,
                    port: configService.getConfig().get('database').port,
                    username: configService.getConfig().get('database').user,
                    password: configService.getConfig().get('database').password,
                    database: configService.getConfig().get('database').name,
                    autoLoadEntities: true,
                    entities: [
                        Game,
                        Player,
                        GamePlayer,
                        GameMoves,
                    ],
                    scriptsFolder: join(__dirname, '..', 'migrations'),
                    logging: ['error']
                };
            },
        }),
        GameModule,
        PlayerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
