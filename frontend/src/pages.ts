interface IPage {
    [key: string]: {
        path: string,
    };
}

const pages: IPage = {
    leaderBoard: { path: '/', },
    game: { path: '/game', },
    login: { path: '/login/:game', },
};

export default pages;
