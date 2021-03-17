import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';

@Module({
    imports: [

    ],
    providers: [
        ConfigService,
    ],
    exports: [
        ConfigService,
    ],
    controllers: [ConfigController],
})
export class ConfigModule { }
