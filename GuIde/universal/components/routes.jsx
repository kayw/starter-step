import { Route } from 'react-router';
import React from 'react';
import Master from './master';
import OldView from '../../client/views/old';
import DocsIO from '../../client/views/docsio';
import TechcuzView from '../../client/views/techcuz';

export default (
  <Route>
    <Route path="/" component={Master}>
      <Route path="techcuz" component={TechcuzView} />
      <Route path="docsio" component={DocsIO} />
    </Route>
    <Route path="/old" component={OldView} />
  </Route>
);
