import { Route, IndexRoute } from 'react-router';
import React from 'react';
import Master from './master';
import DocsIO from '../../client/views/docsio';
import TechcuzView from '../../client/views/techcuz';
import PeopleView from '../../client/views/people';

export default (store) => {
  // todo add onenter when auth came
  const routes = (
    <Route path="/" component={Master}>
      <IndexRoute component={TechcuzView} />
      <Route path="techcuz" component={TechcuzView} />
      <Route path="docsio" component={DocsIO} />
      <Route path="people" component={PeopleView} />
    </Route>
  );
  return routes;
};
