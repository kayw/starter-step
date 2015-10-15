const React = require('react');
const { ClearFix, Mixins, Styles } = require('material-ui');
const { StylePropable, StyleResizable } = Mixins;
const DesktopGutter = Styles.Spacing.desktopGutter;


const FullWidthSection = React.createClass({
  propTypes: {
    useContent: React.PropTypes.bool,
    contentType: React.PropTypes.string,
    children: React.PropTypes.array,
    style: React.PropTypes.object,
    contentStyle: React.PropTypes.object
  },

  mixins: [StylePropable, StyleResizable],

  getDefaultProps() {
    return {
      useContent: false,
      contentType: 'div'
    };
  },

  getStyles() {
    return {
      root: {
        padding: DesktopGutter + 'px',
        boxSizing: 'border-box'
      },
      content: {
        maxWidth: '1200px',
        margin: '0 auto'
      },
      rootWhenSmall: {
        paddingTop: (DesktopGutter * 2) + 'px',
        paddingBottom: (DesktopGutter * 2) + 'px'
      },
      rootWhenLarge: {
        paddingTop: (DesktopGutter * 3) + 'px',
        paddingBottom: (DesktopGutter * 3) + 'px'
      }
    };
  },

  render() {
    const {
      style,
      useContent,
      contentType,
      contentStyle,
      ...other
    } = this.props;

    const styles = this.getStyles();

    let content;
    if (useContent) {
      content =
        React.createElement(
          contentType,
          {style: this.mergeAndPrefix(styles.content, contentStyle)},
          this.props.children
        );
    } else {
      content = this.props.children;
    }

    return (
      <ClearFix {...other}
        style={this.mergeAndPrefix(
          styles.root,
          style,
          this.isDeviceSize(StyleResizable.statics.Sizes.SMALL) && styles.rootWhenSmall,
          this.isDeviceSize(StyleResizable.statics.Sizes.LARGE) && styles.rootWhenLarge)}>
        {content}
      </ClearFix>
    );
  }
});

module.exports = FullWidthSection;
