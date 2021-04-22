import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GamePlayerDto {
    @ApiProperty({
        example: 'Test',
    })
    @IsString()
    public readonly nickname!: string;

    @ApiProperty({
        example: 0,
    })
    @IsNumber()
    public readonly position!: number;
}