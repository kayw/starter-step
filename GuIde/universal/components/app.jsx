import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from '../../client/routes';

injectTapEventPlugin();
export default class App extends Component {

  static propTypes = {
    store: React.PropTypes.object.isRequired,
    routes: React.PropTypes.object
  };
  static defaultProps = {
    initialState: {}
  }

  renderDevTools() {
    const DevTools = require('./redux-dev-dock');
    return <DevTools key="devtools" />;
  }

  renderRouter() {
    return this.props.routes ?
      <ReduxRouter routes={routes} />
      :
      <ReduxRouter />;
  }

  render() {
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
