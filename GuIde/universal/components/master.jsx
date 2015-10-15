const React = require('react');
const AppLeftNav = require('./left-menus');
const FullWidthSection = require('./full-width-section');
const { AppBar, AppCanvas, IconButton, Styles } = require('material-ui');

const { Colors } = Styles;
const ThemeManager = Styles.ThemeManager;
const DefaultRawTheme = Styles.LightRawTheme;
import { PropTypes } from 'react-router';

class Master extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  }

  constructor() {
    super();
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(DefaultRawTheme)
    };
  }

  getStyles() {
    const darkWhite = Colors.darkWhite;
    return {
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center'
      },
      a: {
        color: darkWhite
      },
      p: {
        margin: '0 auto',
        padding: '0',
        color: Colors.lightWhite,
        maxWidth: '335px'
      },
      iconButton: {
        color: darkWhite
      }
    };
  }

  _onLeftIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  }

  render() {
    const styles = this.getStyles();
    const title = 'GuIDE'/*
      this.context.router.isActive('get-started') ? 'Get Started' :
      this.context.router.isActive('customization') ? 'Customization' :
      this.context.router.isActive('components') ? 'Components' : ''*/;

    const githubButton = (
      <IconButton
        iconStyle={styles.iconButton}
        iconClassName="muidocs-icon-custom-github"
        href="https://github.com/kayw/guide"
        linkButton />
    );

    return (
      <AppCanvas>
      <AppBar
          onLeftIconButtonTouchTap={::this._onLeftIconButtonTouchTap}
          title={title}
          zDepth={0}
          style={{position: 'absolute', top: 0}}
      />

        { this.props.children }
        <AppLeftNav ref="leftNav" />
        <FullWidthSection style={styles.footer}>
          <p style={styles.p}>
            Hand crafted with love by the engineers at <a style={styles.a} href="http://kayw.me">kayw</a> and our
            awesome <a style={styles.a} href="https://github.com/callemall/material-ui/graphs/contributors">contributors</a>.
          </p>
          {githubButton}
        </FullWidthSection>

      </AppCanvas>
    );
  }
}

Master.contextTypes = {
  history: PropTypes.history
};

Master.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Master;
