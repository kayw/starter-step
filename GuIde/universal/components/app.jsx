import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, RouterContext } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getPlainRoute from '../../client/routes';

injectTapEventPlugin();
export default class App extends Component {

  static propTypes = {
    store: React.PropTypes.object.isRequired,
    routingContext: React.PropTypes.object,
    routerHisotry: React.PropTypes.object,
  };
  static defaultProps = {
    initialState: {},
  }

  renderDevTools() {
    const DevTools = require('./redux-dev-dock');
    return <DevTools key="devtools" />;
  }

  renderRouter() {
    /*
      invariant(
        this.props.routingContext || this.props.routerHistory,
        '<App /> needs either a routingContext or routerHistory to render.'
      );
    */
    if (this.props.routingContext) {
      return <RouterContext {...this.props.routingContext} />;
    } else {
      return (
        <Router history={this.props.routerHistory}>
        {getPlainRoute(this.props.store)}
        </Router>
      );
    }
  }

  render() {
    return (
        <Provider store={this.props.store}>
          <div>
          {this.renderRouter()}
          {__DEVTOOLS__ && this.renderDevTools()}
          </div>
        </Provider>
    );
  }
}
