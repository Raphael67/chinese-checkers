import pages from 'pages';
import React, { ComponentType, FunctionComponent, ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppState } from 'redux/reducers';

type ServiceProp = keyof IServiceProps;

export interface IServiceProps {
    game?: string;
    player?: IPlayer;
}

export const useLoggedSelector = (): IServiceProps => {
    return useSelector((state: AppState) => {
        const { game, player } = state.session;
        return {
            game,
            player
        };
    });
};

export function WithLogged(MyComponent: FunctionComponent, propsToCheck: ServiceProp[]): ComponentType<any> {
    const WithLoggedComponent = ({ ...props }): ReactElement | null => {
        const session = useLoggedSelector();
        const history = useHistory();
        useEffect(() => {
            if (propsToCheck.find((prop: ServiceProp) => !session[prop])) {
                history.push(pages.leaderBoard.path);
            }
        }, [session, history]);
        return (!propsToCheck.find((prop: ServiceProp) => !session[prop])) ? <MyComponent {...props} /> : null;
    };
    return WithLoggedComponent;
}