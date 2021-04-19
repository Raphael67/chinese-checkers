import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'players' })
export class PlayerEntity extends Document {
    @Prop()
    public nickname: string;

    @Prop()
    public wins: number;

    @Prop()
    public loses: number;

    @Prop()
    public longestStreak: number;

    @Prop()
    public rating: number;
}

export const PlayerSchema = SchemaFactory.createForClass(PlayerEntity);