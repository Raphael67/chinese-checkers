import { Dispatch } from 'react';
import { ISetGame, ISetPath, ISetPawnPlace, ISetPawns, ISetPossiblePlaces, Type } from 'redux/actions/types';
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

export const setPawnPlace = async (dispatch: Dispatch<ISetPawnPlace>, pawn: IPawn, place: string) => {
    dispatch({
        payload: {
            pawn,
            place
        },
        type: Type.SET_PAWN_PLACE
    });
};

export const setPawns = async (dispatch: Dispatch<ISetPawns>, pawns: IPawnPlace[]) => {
    dispatch({
        payload: pawns,
        type: Type.SET_PAWNS
    });
};

export const getGame = async (id: string): Promise<IGame> => {
    return convertRawGame(await Api.getGame({
        gameId: id
    }).catch((err) => {
        throw err;
    }));
};

export const getAndStoreGame = async (dispatch: Dispatch<ISetGame>, id: string): Promise<IGame> => {
    dispatch({
        payload: id,
        type: Type.SET_GAME
    });

    return getGame(id);
};

export const getGames = async (values: ISearchGameParams): Promise<IGame[]> => {
    return (await Api.getGames(values).catch((err) => {
        throw err;
    })).map((rawGame: IRawGame) => {
        return convertRawGame(rawGame);
    });
};

const convertRawGame = (rawGame: IRawGame): IGame => {
    const { created_at, id, longest_streak, players, turn, status } = rawGame;
    return {
        id,
        createdAt: new Date(created_at),
        longestStreak: longest_streak,
        players: players.map((player: IRawGamePlayer): IGamePlayer => {
            const { position, nickname } = player;
            return {
                nickname,
                position
            };
        }),
        status,
        rounds: turn
    };
};