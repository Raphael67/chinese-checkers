import { DatabaseModule } from '@corteks/nest-database';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

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
                    entities: [],
                    scriptsFolder: join(__dirname, '..', 'migrations'),
                };
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
