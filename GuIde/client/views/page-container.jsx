import React, { PropTypes } from 'react';
import cssifyModules from 'react-css-modules';
const pageStyle = require('./page-container.css');

@cssifyModules(pageStyle)
export default class PageContainer extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  }
  render() {
    return (
      <div styleName="root">
        <div styleName="content">
        { this.props.children }
        </div>
      </div>
    );
  }
}
