import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Coords } from '../board/board';
import { GameStatus } from './game.class';

@Schema({ collection: 'games' })
export class GameEntity extends Document {
    @Prop()
    public id: string;

    @Prop()
    public playerNicknames: string[] = [];

    @Prop()
    public status: GameStatus;

    @Prop()
    public creator: string;

    @Prop()
    public turn: number;

    @Prop()
    public longestStreak: number;

    @Prop()
    public winner: string;

    @Prop()
    public moves: Coords[][];

    @Prop()
    public createdAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(GameEntity);