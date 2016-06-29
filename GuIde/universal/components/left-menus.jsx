import React, { PropTypes } from 'react';
import { List, ListItem, Drawer, Divider, Subheader,
  MakeSelectable as selectableContainerEnhance } from 'material-ui';
import { spacing, typography, zIndex } from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';
const SelectableList = selectableContainerEnhance(List);

class AppLeftNav extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    leftNavOpen: PropTypes.bool.isRequired,
    onRequestChangeLeftNav: PropTypes.func.isRequired,
    onRequestChangeLink: PropTypes.func.isRequired,
  }
  getStyles() {
    return {
      cursor: 'pointer',
      fontSize: '24px', // .mui-font-style-headline
      color: typography.textFullWhite,
      lineHeight: `${spacing.desktopKeylineIncrement}px`,
      fontWeight: typography.fontWeightLight,
      backgroundColor: cyan500,
      paddingLeft: spacing.desktopGutter,
      marginBottom: 8,
    };
  }

  handleTouchTapHeader = () => {
    this.props.onRequestChangeLink('/');
  }

  handleRequestChangeList = (ev, value) => {
    this.props.onRequestChangeLink(value);
  }

  handleRequestChangeLink = (ev, value) => {
    window.location = value;
  }

  render() {
    const { onRequestChangeLeftNav, leftNavOpen, location } = this.props;
    return (
      <Drawer docked={false} open={leftNavOpen} onRequestChange={onRequestChangeLeftNav}
        containerStyle={{ zIndex: zIndex.drawer - 100 }}
      >
        <div style={this.getStyles()} onTouchTap={this.handleTouchTapHeader}>
          GuIde
        </div>
        <SelectableList value={location.pathname} onChange={this.handleRequestChangeList}>
          <ListItem primaryText="techcuz" value="/techcuz" />
          <ListItem primaryText="docs.io" value="/docsio" />
          <ListItem primaryText="people" value="/people" />
          <ListItem primaryText="grab-reader" value="/offline" />
          <ListItem primaryText="playground" value="/whiteboard" />
          <ListItem primaryText="saviour" value="/saviour" />
        </SelectableList>
        <Divider />
        <SelectableList value="" onChange={this.handleRequestChangeLink}>
          <Subheader>Tools</Subheader>
          <ListItem primaryText="Material-UI" value="https://github.com/callemall/material-ui" />
          <ListItem primaryText="React" value="http://facebook.github.io/react" />
        </SelectableList>
      </Drawer>);
  }
}

module.exports = AppLeftNav;
