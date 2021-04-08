import App from 'components/app';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'redux/store';
import Game from './core/game';

const contextValue = {
    game: new Game(store),
};

export const AppContext = React.createContext(contextValue);

ReactDOM.render(
    <AppContext.Provider value={contextValue}>
        <Provider store={store}>
            <App />
        </Provider>
    </AppContext.Provider>,
    document.getElementById('root') || document.createElement('div'),
);
