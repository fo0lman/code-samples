import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { extractSession } from './utils/session';

import App from './containers/App.jsx';
import AboutPage from './containers/AboutPage.jsx';
import MoviePage from './containers/MoviePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SearchPage from './containers/SearchPage.jsx';
import MovieRecommendationsPage from './containers/MovieRecommendationsPage.jsx';
import MovieSimilarPage from './containers/MovieSimilarPage.jsx';

import LoggedInLayout from './components/LoggedInLayout.jsx';

import requireAuth from './hoc/requireAuth.jsx';
import configureStore from './store';
import { restoreAuth } from './actions';

import 'normalize.css';
import './assets/main.css';

const routes = (
    <Route path="/" component={App}>
        <IndexRoute component={LoginPage} />
        <Route path="login" component={LoginPage} />
        <Route path="about" component={AboutPage} />

        <Route component={requireAuth(LoggedInLayout)}>
            <Route path="movies" component={SearchPage} />
            <Route path="movies/:id" component={MoviePage}>
                <Route path="recommendations" component={MovieRecommendationsPage} />
                <Route path="similar" component={MovieSimilarPage} />
            </Route>
        </Route>
    </Route>
);

const store = configureStore({}, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const renderApp = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                {routes}
            </Router>
        </Provider>,
        document.getElementById('root')
    );
}

const startApp = () => {
    const session = extractSession();

    if (session) {
        store.dispatch(restoreAuth(session)).then(() => renderApp());
    } else {
        renderApp();
    }
}

startApp();
