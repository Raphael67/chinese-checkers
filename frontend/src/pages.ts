interface IPage {
    [key: string]: {
        path: string,
    };
}

const pages: IPage = {
    main: { path: '/', },
    game: { path: '/game', },
    login: { path: '/login', },
};

export default pages;
