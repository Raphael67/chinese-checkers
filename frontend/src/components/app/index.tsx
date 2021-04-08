import 'assets/fonts/d-din-webfont.woff';
import DefaultLayout from 'layouts/default';
import Loading from 'layouts/loading';
import pages from 'pages';
import React, { ReactElement, Suspense } from 'react';
import {
    BrowserRouter as Router,
    Switch
} from 'react-router-dom';
import './index.less';

const LeaderBoardPage = React.lazy(() => import('components/leader-board'));
const LoginPage = React.lazy(() => import('components/login'));
const GamePage = React.lazy(() => import('components/game'));

const App = (): ReactElement => {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <DefaultLayout exact path={pages.leaderBoard.path} component={LeaderBoardPage} />
                    <DefaultLayout exact path={pages.login.path} component={LoginPage} />
                    <DefaultLayout exact path={pages.game.path} component={GamePage} />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default App;
