import { v4 as uuid } from 'uuid';

export class Player {
    public constructor(nickname: string) {
        this.nickname = nickname;
    }
    public id: string = uuid();
    public nickname: string;
    public online: boolean;
    public isBot: boolean;
    public wins: number;
    public loses: number;
    public longestStreak: number;
    public rating: number;
}