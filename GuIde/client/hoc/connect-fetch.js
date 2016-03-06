import React, { PropTypes } from 'react';

// https://github.com/este/este/blob/master/src/common/components/fetch.js
export default function connectFetch(...actions) {
  // rest parameter https://hacks.mozilla.org/2015/05/es6-in-depth-rest-parameters-and-defaults/
  return Wrapped => class Fetch extends React.Component {
    static contextTypes = {
      store: PropTypes.object // Redux store.
    };

    // Passed via react-router or can be passed manually in React Native.
    static propTypes = {
      location: PropTypes.object,
      params: PropTypes.object
    };

    // For server side in loadOnServer
    static fetchers = actions;

    // For client side fetching.
    componentDidMount() {
      const { store: { getState, dispatch } } = this.context;
      const { location, params } = this.props;
      actions.forEach(action => dispatch(action({
        state: getState(), dispatch, location, params
      })));
    }
    render() {
      return <Wrapped {...this.props} />;
    }
  };
}
