// https://github.com/rackt/redux-router/pull/62#issuecomment-156225020
import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';

// https://github.com/joshgeller/react-redux-jwt-auth-example/blob/master/src/components/AuthenticatedComponent.js
export function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      location: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired,
      isAuthenticated: PropTypes.bool.isRequired
    }
    componentWillMount() {
      this.checkAuth();
    }
    componentWillReceiveProps(nextProps) {
      // for logouts
      this.checkAuth();
    }
    checkAuth() {
      if (!this.props.isAuthenticated) {
        const redirectAfterLogin = this.props.location.pathname;
        this.props
        .dispatch(pushState(null, `/login?next=${redirectAfterLogin}`));
      }
    }
    render() {
      return (
        <div>
        {this.props.isAuthenticated === true
          ? <Component {...this.props}/>
          : null
        }
        </div>
      );
    }
  }
  const mapStateToProps = (state) => ({
    token: state.auth.token,
    userName: state.auth.userName,
    isAuthenticated: state.auth.isAuthenticated
  });
  return connect(mapStateToProps)(AuthenticatedComponent);
}
