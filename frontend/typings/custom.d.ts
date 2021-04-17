declare interface IRegisterParams {
    nickname: string;
    position: number;
}

declare interface ISearchGameParams {
    player?: name;
    date?: Date;
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

declare interface IRawGame {
    id: string;
    current_player: number;
    players: IRawGamePlayer[];
    created_at: Date;
    longest_streak?: number;
    status: 'CREATED' | 'STARTED' | 'FINISHED';
    turn: number;
}

declare interface IRawGamePlayer {
    nickname: string;
    position: number;
}

declare interface IGame {
    id: string;
    players?: IGamePlayer[];
    createdAt: Date;
    longestStreak?: number;
    status: IRawGame['status'];
    rounds?: number;
}

declare interface IPlayer {
    nickname: string;
    position?: number;
    status?: 'idle' | 'disconnected' | 'playing';
}

declare interface IGamePlayer extends IPlayer {
    createdAt?: Date;
    id?: number;
    lose?: number;
    rating?: number;
    updatedAt?: Date;
    win?: number;
}

declare interface IPawn {
    id: string;
    colour: number;
}

declare interface IPawnPlace {
    pawn: IPawn;
    place: string;
}

declare interface IPawnPosition {
    pawn: IPawn;
    position: IPosition;
}

declare interface IPath {
    place: string;
    fromOverPawn?: boolean;
}

declare type IBoard = Record<string, string>;

declare interface IRawPawn {
    coords: IPosition;
    pawn: number;
}

declare type IRawBoard = IRawPawn[];

declare interface IMove {
    from: string;
    to: string;
}

declare interface IPosition {
    x: number;
    y: number;
}

declare interface IColourPosition {
    [key: number]: number;
}