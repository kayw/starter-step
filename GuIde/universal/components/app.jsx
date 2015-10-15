import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, RoutingContext } from 'react-router';
import invariant from 'invariant';
import { DevTools, LogMonitor, DebugPanel } from 'redux-devtools/lib/react';
// import config from '../config';
import routes from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
// const __DEBUG__ = config.get('globals').__DEBUG__;

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
    return (
      <DebugPanel top right bottom key="debugPanel">
        <DevTools store={this.props.store} monitor={LogMonitor} />
      </DebugPanel>
    );
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
      <div>
        <Provider store={this.props.store}>
          { this.renderRouter()}
        </Provider>
        {/* __DEBUG__ && this.renderDevTools()*/}
      </div>
    );
  }
}
