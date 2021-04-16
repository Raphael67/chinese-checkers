import { PrimaryColumn } from 'typeorm';

export class Player {
    @PrimaryColumn()
    public id: number;
    public nickname: string;
    public online: boolean;
    public isBot: boolean;
    public wins: number;
    public loses: number;
    public longestStreak: number;
    public rating: number;
}