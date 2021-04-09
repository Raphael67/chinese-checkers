import store from 'redux/store';
import { IRoute, routes } from '../routes';

interface IConfig {
    api: {
        hostname: string;
        port: string;
        protocol: string;
        path?: string;
    };
}

let config: IConfig = {
    api: {
        hostname: window.location.host,
        port: window.location.port,
        protocol: window.location.protocol,
    },
};

export default class Api {
    public static register(gameParams: IGameParams, params: IRegisterParams): Promise<IUser> {
        return Api.fetch(
            routes.register,
            gameParams,
            {
                body: JSON.stringify(params),
            },
        );
    }

    public static getGames(params: ISearchGameParams): Promise<IGame[]> {
        return Api.fetch(
            routes.games,
            params,
        );
    }

    public static newGame(): Promise<IGame> {
        return Api.fetch(
            routes.newGame,
        );
    }

    public static getGame(params: IGameParams): Promise<IGame> {
        return Api.fetch(
            routes.game,
            params
        );
    }

    public static getPlayers(): Promise<IPlayer[]> {
        return Api.fetch(
            routes.players,
        );
    }

    public static getBoard(params: IGameParams): Promise<IBoard> {
        return Api.fetch(
            routes.board,
            params
        );
    }

    public static getMoves(params: IGameParams): Promise<IMove[]> {
        return Api.fetch(
            routes.moves,
            params
        );
    }

    public static newMove(params: IMoveParams): Promise<IMove> {
        return Api.fetch(
            routes.newMove,
            params
        );
    }

    private static async fetch(
        route: IRoute,
        params: any = {},
        optionsSupp: Partial<RequestInit> = {},
        accessToken?: string,
    ): Promise<any> {
        const routeReplaced = {
            ...route,
            path: this.replaceInPath(route.path, params),
        };

        const token = accessToken ? accessToken : (store.getState().session.token || null);

        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
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
            );
        } catch (ex) {
            // tslint:disable-next-line:no-console
            console.error(ex);
            throw ex;
        }

        try {
            json = await response.json();
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
            (config.api.port ? ':' + config.api.port : '') +
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
