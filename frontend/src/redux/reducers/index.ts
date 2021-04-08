import { combineReducers } from 'redux';
import game from './game.reducer';
import session from './session.reducer';

export const rootReducer = combineReducers({
    game,
    session
});

export type AppState = ReturnType<typeof rootReducer>;
