import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import App from './components/app';

import store from './store';

import 'font-awesome/scss/font-awesome.scss';
import './styles/styles.scss';

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept('./components/app', () => {
        const NewApp = require('./components/app').default;
        render(
            <Provider store={store}>
                <NewApp />
            </Provider>,
            document.getElementById('app')
        );
    });
}
