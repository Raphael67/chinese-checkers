declare interface IRegisterParams {
    nickname: string;
    color: 'BLACK' | 'BLUE' | 'PURPLE' | 'YELLOW' | 'GREEN' | 'RED';
}

declare interface ISearchGameParams {
    player: name;
    date: Date;
    orderBy: 'created_at' | 'rounds';
}
declare interface IGameParams {
    gameId: string;
}

declare interface IMoveParams {
    gameId: string;
    playerIndex: number;
    moves: number[][];
}

declare interface IUser {
    token: string;
}

declare interface IGame {
    id: string;
    date: Date;
    players?: IGamePlayer[];
    createdAt: Date;
    longestStreak?: number;
    rounds?: number;
    status: 'CREATED';
}

declare interface IPlayer {
    nickname: string;
    colour?: number;
    status?: 'idle' | 'disconnected' | 'playing';
}

declare interface IGamePlayer extends IPlayer {
    createdAt: Date;
    id: number;
    lose?: number;
    rating?: number;
    updatedAt?: Date;
    win?: number;
}

declare interface IPawnPlace {
    pawn: string;
    place: string;
}

declare interface IPath {
    place: string;
    fromOverPawn: boolean;
}

declare type IBoard = Record<string, string>;

declare interface IRawPawn {
    x: number;
    y: number;
    pawn: number;
}

declare type IRawBoard = IRawPawn[];

declare interface IMove {
    from: string;
    to: string;
}