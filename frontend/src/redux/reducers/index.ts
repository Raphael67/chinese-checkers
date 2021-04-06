import { combineReducers } from 'redux';
import session from './session.reducer';

export const rootReducer = combineReducers({
    session,
});

export type AppState = ReturnType<typeof rootReducer>;
