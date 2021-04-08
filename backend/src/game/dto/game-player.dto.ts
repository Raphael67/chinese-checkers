import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Color } from '../game-player.entity';

export class GamePlayerDto {
    @ApiProperty({
        example: 'Test'
    })
    @IsString()
    readonly nickname: string;

    @ApiProperty({
        example: Color.RED,
        enum: Color
    })
    @IsEnum(Color)
    readonly color: Color;
}