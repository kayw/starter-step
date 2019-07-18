import React, { PropTypes } from 'react';
import AppLeftNav from './left-menus';
import FullWidthSection from './full-width-section';
import { AppBar, IconButton } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { darkWhite, lightWhite, grey900 } from 'material-ui/styles/colors';

export default class Master extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.object,
  }
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  static childContextTypes = {
    muiTheme: PropTypes.object,
  }

  state = {
    muiTheme: getMuiTheme(),
    leftNavOpen: false,
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
    };
  }
  componentWillMount() {
    this.setState({
      muiTheme: this.state.muiTheme,
    });
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme,
    });
  }
  getStyles() {
    return {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: lightWhite,
        maxWidth: '335px',
      },
      iconButton: {
        color: darkWhite,
      },
    };
  }

  handleTouchTapLeftIcon = () => {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });
  }
  handleRequestChangeLeftNav = (open) => {
    this.setState({
      leftNavOpen: open,
    });
  }
  handleRequestChangeLink = (link) => {
    this.context.router.push({ pathname: link });
    this.handleRequestChangeLeftNav(false);
  }

  render() {
    const styles = this.getStyles();
    const title = 'GuIDE';

    const githubButton = (
      <IconButton
        iconStyle={styles.iconButton}
        iconClassName="socicon socicon-github"
        href="https://github.com/kayw/starter-step/guide"
        linkButton
      />);

    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIcon}
          title={title}
          zDepth={0}
          iconElementRight={githubButton}
          style={styles.appBar}
        />
        {this.props.children}
        <AppLeftNav onRequestChangeLeftNav={this.handleRequestChangeLeftNav}
          location={this.props.location} onRequestChangeLink={this.handleRequestChangeLink}
          leftNavOpen={this.state.leftNavOpen}
        />
        <FullWidthSection style={styles.footer}>
          <p style={styles.p}>
            Hand crafted with <i className="md md-favorite" /> by <a style={styles.a} href="http://kayw.me">kayw</a>
          </p>
          {githubButton}
        </FullWidthSection>
      </div>
    );
  }
}
