import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
// https://github.com/emmenko/redux-react-router-async-example/blob/master/lib/components/DevTools.js
export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="meta-H"
    changePositionKey="meta-j">
    <LogMonitor />
  </DockMonitor>
);
