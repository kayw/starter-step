import React from 'react';

// https://github.com/este/este/blob/master/src%2Fcommon%2Fcomponents%2FcreateFetch.js
export default function connectFetch(...actions) {
  // rest parameter https://hacks.mozilla.org/2015/05/es6-in-depth-rest-parameters-and-defaults/
  return (Wrapped) => class extends React.Component {
    static fetchers = actions;
    render() {
      return <Wrapped {...this.props} />;
    }
  };
}
