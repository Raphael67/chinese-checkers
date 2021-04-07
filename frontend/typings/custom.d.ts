declare interface IRegisterParams {
    login: string;
}

declare interface IUser {
    token: string;
}

declare interface IGame {
    id: string;
    date: Date;
    numberOfRounds: number;
    players: IPlayer[];
}

declare interface IPlayer {
    colour?: number;
    name: string;
    status?: 'idle' | 'disconnected' | 'playing';
}