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
    playerIndex: string;
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

declare interface IPawnPlace {
    pawn: string;
    place: string;
}

declare interface IPath {
    place: string;
    fromOverPawn: boolean;
}
declare interface IBoard {
    pawns: string[];
}

declare interface IMove {
    from: string;
    to: string;
}