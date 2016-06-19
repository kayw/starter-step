import { Route, IndexRoute } from 'react-router';
import React from 'react';
import Master from '../universal/components/master';
import PageContainer from './views/page-container';
import DocsIO from './views/docsio';
import TechcuzView from './views/techcuz';
import PeopleView from './views/people';

export default (store) => {
  function requireAuth(nextState, replaceState, callback) {
    function checkAuth() {
      const { auth: { isAuthed } } = store.getState();
      if (!isAuthed) {
        const redirection = this.props.location.pathname;
        replaceState(null, `/login?next=${redirection}`);
      }
      callback();
    }
    checkAuth();
  }
  const routes = (
    <Route path="/" component={Master}>
      <Route onEnter={requireAuth} />
      <Route component={PageContainer}>
        <IndexRoute component={TechcuzView} />
        <Route path="techcuz" component={TechcuzView} />
        <Route path="docsio" component={DocsIO} />
        <Route path="people" component={PeopleView} />
      </Route>
    </Route>
  );
  return routes;
};
