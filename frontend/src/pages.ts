interface IPage {
    [key: string]: {
        path: string,
    };
}

const pages: IPage = {
    leaderBoard: { path: '/', },
    game: { path: '/game/:gameId', },
    replay: { path: '/replay/:gameId', },
    login: { path: '/login/:gameId', },
};

export default pages;
