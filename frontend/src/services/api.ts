import { IRoute, routes } from 'routes';

interface IConfig {
    api: {
        hostname: string;
        port: number;
        protocol: string;
        path?: string;
    };
}

let config: IConfig = {
    api: {
        hostname: 'game.corteks.net',
        port: 443,
        protocol: 'https:',
        path: '/api'
    },
};

export default class Api {
    public static register(gameParams: IGameParams, params: IRegisterParams): Promise<IUser> {
        const { nickname, position } = params;
        return Api.fetch(
            routes.register,
            gameParams,
            {
                body: JSON.stringify({
                    nickname,
                    position
                }),
            },
        );
    }

    public static getGames(params: ISearchGameParams): Promise<IRawGame[]> {
        const { orderBy, date, player } = params;
        const newParams: any = {
            orderBy
        };
        if (date) {
            newParams.date = Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: 'numeric' })
                .formatToParts(date)
                .filter((datePart: Intl.DateTimeFormatPart) => ['day', 'month', 'year'].includes(datePart.type))
                .sort(((a: Intl.DateTimeFormatPart, b: Intl.DateTimeFormatPart) => a.type.localeCompare(b.type)))
                .reverse()
                .map((datePart: Intl.DateTimeFormatPart) => datePart.value)
                .join('-');
        }
        if (player) {
            newParams.player = player;
        }

        return Api.fetch(
            routes.games,
            newParams,
        );
    }

    public static newGame(): Promise<IGame> {
        return Api.fetch(
            routes.newGame,
        );
    }

    public static async getGame(params: IGameParams): Promise<IRawGame> {
        return await Api.fetch(
            routes.game,
            params
        );
    }

    public static getPlayers(): Promise<IPlayer[]> {
        return Api.fetch(
            routes.players,
        );
    }

    public static getBoard(params: IGameParams): Promise<IRawBoard> {
        return Api.fetch(
            routes.board,
            params
        );
    }

    public static getMoves(params: IGetMoveParams): Promise<IPosition[][]> {
        return Api.fetch(
            routes.moves,
            params
        );
    }

    public static newMove(params: IMoveParams) {
        const { gameId, moves, playerIndex } = params;
        return Api.fetch(
            routes.newMove,
            {
                gameId,
                playerIndex
            },
            {
                body: JSON.stringify(moves),
            },
        );
    }

    public static startGame(params: IGameParams) {
        return Api.fetch(
            routes.gameStart,
            {
                gameId: params.gameId
            }
        );
    }

    private static async fetch(
        route: IRoute,
        params: any = {},
        optionsSupp: Partial<RequestInit> = {},
    ): Promise<any> {
        const routeReplaced = {
            ...route,
            path: this.replaceInPath(route.path, params),
        };

        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: route.method,
            ...optionsSupp,
        };

        let response: Response | undefined;
        let json: any | undefined;
        try {
            response = await fetch(
                this.getApiHost() + routeReplaced.path,
                options,
            ).catch((err) => {
                throw err;
            });
        } catch (ex) {
            // tslint:disable-next-line:no-console
            console.error(ex);
            throw ex;
        }

        try {
            json = await response.json().catch((err) => {
                throw err;
            });
        } catch (ex) {
            // tslint:disable-next-line:no-console
            console.warn(ex);
        }

        if (response.status < 200 || response.status >= 300) {
            const errorMessage =
                json && json.message ? json.message : 'An error occured';
            const error = new Error(errorMessage);
            (error as any).response = response;
            // throw error
            throw error;
        }
        return json;
    }

    private static getApiHost(): string {
        return (
            config.api.protocol +
            '//' +
            (config.api.hostname
                ? config.api.hostname
                : document.location.hostname) +
            (config.api.path || '')
        );
    }

    private static replaceInPath(path: string, params: any): string {
        let pathReplaced = path;
        let queryParams = '';
        Object.keys(params).forEach((key) => {
            if (pathReplaced.indexOf('{' + key + '}') !== -1) {
                pathReplaced = pathReplaced.replace(
                    '{' + key + '}',
                    params[key],
                );
            } else {
                if (!queryParams) {
                    queryParams = '?';
                    queryParams += key + '=' + params[key];
                } else {
                    queryParams += '&' + key + '=' + params[key];
                }
            }
        });
        return pathReplaced + queryParams;
    }
}
