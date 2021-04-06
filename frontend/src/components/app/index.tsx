import 'assets/fonts/d-din-webfont.woff';
import DefaultLayout from 'layouts/default';
import Loading from 'layouts/loading';
import pages from 'pages';
import React, { ReactElement, Suspense } from 'react';
import { Provider } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch
} from 'react-router-dom';
import store from 'redux/store';
import './index.less';

const MainPage = React.lazy(() => import('components/main'));
const LoginPage = React.lazy(() => import('components/login'));
const GamePage = React.lazy(() => import('components/game'));

const App = (): ReactElement => {
    return (
        <Provider store={store}>
            <Router>
                <Suspense fallback={<Loading />}>
                    <Switch>
                        <DefaultLayout exact path={pages.main.path} component={MainPage} />
                        <DefaultLayout exact path={pages.login.path} component={LoginPage} />
                        <DefaultLayout exact path={pages.game.path} component={GamePage} />
                    </Switch>
                </Suspense>
            </Router>
        </Provider>
    );
};

export default App;
