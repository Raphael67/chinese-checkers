export interface IRoute {
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
}

export const routes: Record<string, IRoute> = {
    register: {
        method: 'POST',
        path: '/game/{gameId}/player',
    },
    games: {
        method: 'GET',
        path: '/game',
    },
    newGame: {
        method: 'POST',
        path: '/game',
    },
    game: {
        method: 'GET',
        path: '/game/{gameId}',
    },
    players: {
        method: 'GET',
        path: '/player',
    },
    board: {
        method: 'GET',
        path: '/board/{gameId}',
    },
    moves: {
        method: 'GET',
        path: '/board/{gameId}/move',
    },
    newMove: {
        method: 'POST',
        path: '/board/{gameId}/player/{playerIndex}/move'
    },
    gameStart: {
        method: 'PATCH',
        path: '/game/{gameId}/start'
    }
};
