import { ApiProperty } from '@nestjs/swagger';
import { Color } from '../game-player.entity';

export class GamePlayerDto {
    @ApiProperty({
        example: 'Test'
    })
    nickname: string;

    @ApiProperty({
        example: Color.RED
    })
    color: Color;
}