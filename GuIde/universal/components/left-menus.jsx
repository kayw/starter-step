const React = require('react');
const { MenuItem, LeftNav, Styles } = require('material-ui');
const { Colors, Spacing, Typography } = Styles;
import { PropTypes } from 'react-router';

const menuItems = [
  { route: '/techcuz', text: 'techcuz'},
  { route: '/docsio', text: 'docs.io' },
  { route: '/people', text: 'people' },
  { route: '/offline', text: 'grab-reader' },
  { route: '/whiteboard', text: 'playground' },
  { route: '/saviour', text: 'saviour' },
  { type: MenuItem.Types.SUBHEADER, text: 'Tools' },
  { type: MenuItem.Types.LINK, payload: 'https://github.com/callemall/material-ui', text: 'Material-UI' },
  { type: MenuItem.Types.LINK, payload: 'http://facebook.github.io/react', text: 'React' }
];


class AppLeftNav extends React.Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this._getSelectedIndex = this._getSelectedIndex.bind(this);
    this._onLeftNavChange = this._onLeftNavChange.bind(this);
    this._onHeaderClick = this._onHeaderClick.bind(this);
  }

  getStyles() {
    return {
      cursor: 'pointer',
      fontSize: '24px',// .mui-font-style-headline
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.cyan500,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '8px'
    };
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  _getSelectedIndex() {
    let currentItem;

    for (let i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      if (currentItem.route && this.context.history.isActive(currentItem.route)) {
        return i;
      }
    }
  }

  _onLeftNavChange(ev, key, payload) {
    // this.context.history.transitionTo(payload.route);
    this.context.history.pushState(null, payload.route);
  }

  _onHeaderClick() {
    // this.context.history.transitionTo('root');
    this.context.history.pushState(null, '/');
    this.refs.leftNav.close();
  }

  render() {
    const header = (
      <div style={this.getStyles()} onTouchTap={this._onHeaderClick}>
        GuIde
      </div>
    );

    return (
      <LeftNav
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={menuItems}
        selectedIndex={this._getSelectedIndex()}
        onChange={this._onLeftNavChange} />
    );
  }
}

AppLeftNav.contextTypes = {
  history: PropTypes.history
};

module.exports = AppLeftNav;
