import { ClassSerializerInterceptor, Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';


@ApiTags('Config')
@Controller('/api/config')
@UseInterceptors(ClassSerializerInterceptor)
export class ConfigController {
    @Inject(ConfigService)
    private readonly configService: ConfigService;

    @Get('version')
    @ApiOperation({
        summary: 'Get project version',
    })
    @ApiResponse({
        status: 200,
        description: 'Current version of the project',
        type: String,
    })
    public getVersion(): string {
        return this.configService.getVersion();
    }
}
