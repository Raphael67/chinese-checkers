import { v4 as uuid } from 'uuid';

export class Player {
    public constructor(nickname: string) {
        this.nickname = nickname;
    }
    public id: string = uuid();
    public nickname: string;
    public online: boolean = false;
    public isBot: boolean = false;
    public wins: number = 0;
    public loses: number = 0;
    public longestStreak: number = 0;
    public rating: number = 0;
}