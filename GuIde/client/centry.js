import React from 'react';
import ReactDom from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import App from '../universal/components/app';
import configureStore from '../universal/redux/configureStore';
const store = configureStore(window.__INITIAL_STATE__);
ReactDom.render(<App routerHistory={createBrowserHistory()} store={store} />,
             document.getElementById('mount'));
