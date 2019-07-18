import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import { fromJS } from 'immutable';
import App from '../universal/components/app';
import configureStore from '../universal/redux/configureStore';

const initialState = window.__INITIAL_STATE__ || undefined;
if (initialState) {
  Object.keys(initialState).forEach((key) => {
    if (key !== 'router') {
      initialState[key] = fromJS(initialState[key]);
    }
  });
}
const store = configureStore(initialState);
ReactDom.render(<App routerHistory={browserHistory} store={store} />,
             document.getElementById('mount'));
