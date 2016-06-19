import React, { PropTypes } from 'react';
import { List, ListItem, LeftNav, Divider,
  SelectableContainerEnhance as selectableContainerEnhance, Styles } from 'material-ui';
const { Colors, Spacing, Typography } = Styles;
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
      color: Typography.textFullWhite,
      lineHeight: `${Spacing.desktopKeylineIncrement}px`,
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.cyan500,
      paddingLeft: Spacing.desktopGutter,
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
      <LeftNav docked={false} open={leftNavOpen} onRequestChange={onRequestChangeLeftNav}>
        <div style={this.getStyles()} onTouchTap={this.handleTouchTapHeader}>
          GuIde
        </div>
        <SelectableList valueLink={{ value: location.pathname,
          requestChange: this.handleRequestChangeList }}>
          <ListItem primaryText="techcuz" value="/techcuz" />
          <ListItem primaryText="docs.io" value="/docsio" />
          <ListItem primaryText="people" value="/people" />
          <ListItem primaryText="grab-reader" value="/offline" />
          <ListItem primaryText="playground" value="/whiteboard" />
          <ListItem primaryText="saviour" value="/saviour" />
        </SelectableList>
        <Divider />
        <SelectableList subheader="Tools" valueLink={{
          value: '', requestChange: this.handleRequestChangeLink,
        }}>
          <ListItem primaryText="Material-UI" value="https://github.com/callemall/material-ui" />
          <ListItem primaryText="React" value="http://facebook.github.io/react" />
        </SelectableList>
      </LeftNav>);
  }
}

module.exports = AppLeftNav;
