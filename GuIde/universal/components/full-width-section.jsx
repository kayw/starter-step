const React = require('react');
const { ClearFix, Mixins, Styles } = require('material-ui');
const { StylePropable, StyleResizable } = Mixins;
const DesktopGutter = Styles.Spacing.desktopGutter;

const FullWidthSection = React.createClass({

  propTypes: {
    children: React.PropTypes.node,
    contentStyle: React.PropTypes.object,
    contentType: React.PropTypes.string,
    style: React.PropTypes.object,
    useContent: React.PropTypes.bool
  },

  mixins: [
    StylePropable,
    StyleResizable
  ],

  getDefaultProps() {
    return {
      useContent: false,
      contentType: 'div'
    };
  },

  getStyles() {
    return {
      root: {
        padding: `${DesktopGutter}px`,
        boxSizing: 'border-box'
      },
      content: {
        maxWidth: '1200px',
        margin: '0 auto'
      },
      rootWhenSmall: {
        paddingTop: DesktopGutter * 2,
        paddingBottom: DesktopGutter * 2
      },
      rootWhenLarge: {
        paddingTop: DesktopGutter * 3,
        paddingBottom: DesktopGutter * 3
      }
    };
  },

  render() {
    /* eslint-disable no-use-before-define */
    const {
      style,
      useContent,
      contentType,
      contentStyle,
      ...other
    } = this.props;
    /* eslint-disable no-use-before-define */

    const styles = this.getStyles();

    let content;
    if (useContent) {
      content =
        React.createElement(
          contentType,
          { style: this.mergeStyles(styles.content, contentStyle) },
          this.props.children
        );
    } else {
      content = this.props.children;
    }

    return (
      <ClearFix
        {...other}
        style={this.mergeStyles(
          styles.root,
          style,
          this.isDeviceSize(StyleResizable.statics.Sizes.SMALL) && styles.rootWhenSmall,
          this.isDeviceSize(StyleResizable.statics.Sizes.LARGE) && styles.rootWhenLarge)}
      >
        {content}
      </ClearFix>
    );
  }
});

module.exports = FullWidthSection;
