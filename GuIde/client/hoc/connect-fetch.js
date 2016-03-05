import React from 'react';

// https://github.com/este/este/blob/master/src/common/components/fetch.js
export default function connectFetch(...actions) {
  // rest parameter https://hacks.mozilla.org/2015/05/es6-in-depth-rest-parameters-and-defaults/
  return Wrapped => class Fetch extends React.Component {
    static fetchers = actions;
    render() {
      // todo babel 6 will optimize out actions
      actions; // eslint-disable-line no-unused-expressions
      return <Wrapped {...this.props} />;
    }
  };
}
