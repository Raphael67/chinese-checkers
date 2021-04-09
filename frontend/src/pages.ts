interface IPage {
    [key: string]: {
        path: string,
    };
}

const pages: IPage = {
    leaderBoard: { path: '/', },
    game: { path: '/game/:gameId', },
    login: { path: '/login/:gameId', },
};

export default pages;
