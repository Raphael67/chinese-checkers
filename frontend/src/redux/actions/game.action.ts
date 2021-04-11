import { ColourMap } from 'core/board';
import { Dispatch } from 'react';
import { ISetGame, ISetPath, ISetPawnPlace, ISetPossiblePlaces, Type } from 'redux/actions/types';
import Api from 'services/api';

export const setPossiblePlaces = async (dispatch: Dispatch<ISetPossiblePlaces>, possiblePlaces: string[]) => {
    dispatch({
        payload: possiblePlaces,
        type: Type.SET_POSSIBLE_PLACES
    });
};

export const setPath = async (dispatch: Dispatch<ISetPath>, path: string[]) => {
    dispatch({
        payload: path,
        type: Type.SET_PATH
    });
};

export const setPawnPlace = async (dispatch: Dispatch<ISetPawnPlace>, pawn: string, place: string) => {
    dispatch({
        payload: {
            pawn,
            place
        },
        type: Type.SET_PAWN_PLACE
    });
};

export const getGame = async (dispatch: Dispatch<ISetGame>, id: string): Promise<IGame> => {
    const game = await Api.getGame({
        gameId: id
    }).catch((err) => {
        throw err;
    });

    dispatch({
        payload: id,
        type: Type.SET_GAME
    });

    return game;
};

export const getGames = async (values: ISearchGameParams): Promise<IGame[]> => {
    return (await Api.getGames(values).catch((err) => {
        throw err;
    })).map((game: IRawGame) => {
        const { created_at, game_id, longest_streak, players, rounds } = game;
        return {
            id: game_id,
            createdAt: new Date(created_at),
            longestStreak: longest_streak,
            players: players.map((player: IRawGamePlayer): IGamePlayer => {
                const { color, nickname } = player;
                return {
                    nickname,
                    colour: ColourMap[color as IRegisterParams['color']]
                };
            }),
            rounds
        };
    });
};