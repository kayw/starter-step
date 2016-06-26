import React, { PropTypes } from 'react';
import cssifyModules from 'react-css-modules';
const pageStyle = require('./page-container.css');

function PageContainer(props) {
  return (
    <div styleName="root">
      <div styleName="content">
      {props.children}
      </div>
    </div>
  );
}
PageContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default cssifyModules(pageStyle)(PageContainer);
