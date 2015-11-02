import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, RoutingContext } from 'react-router';
import invariant from 'invariant';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';

injectTapEventPlugin();
export default class App extends Component {

  static propTypes = {
    store           : React.PropTypes.object.isRequired,
    routingContext  : React.PropTypes.object,
    routerHistory   : React.PropTypes.object
  };
  static defaultProps = {
    initialState : {}
  }

  constructor () {
    super();
  }

  renderDevTools () {
    const DevTools = require('./redux-dev-dock');
    return <DevTools key="devtools" />;
  }

  renderRouter () {
    invariant(
      this.props.routingContext || this.props.routerHistory,
      '<App /> needs either a routingContext or routerHistory to render.'
    );

    if (this.props.routingContext) {
      return <RoutingContext {...this.props.routingContext} />;
    } else {
      return (
        <Router history={this.props.routerHistory}>
        {routes}
        </Router>
      );
    }
  }

  render () {
    return (
        <Provider store={this.props.store}>
          <div>
          { this.renderRouter()}
          { __DEVTOOLS__ && this.renderDevTools() }
          </div>
        </Provider>
    );
  }
}
