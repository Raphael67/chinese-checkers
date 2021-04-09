import { ClassSerializerInterceptor, Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';


@ApiTags('Config')
@Controller('config')
@UseInterceptors(ClassSerializerInterceptor)
export class ConfigController {
    @Inject(ConfigService)
    private readonly configService: ConfigService;

    @Get('version')
    @ApiOperation({
        summary: 'Get project version',
    })
    public getVersion(): string {
        return this.configService.getVersion();
    }
}
