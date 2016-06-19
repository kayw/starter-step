const React = require('react');
const AppLeftNav = require('./left-menus');
const FullWidthSection = require('./full-width-section');
const { AppBar, AppCanvas, IconButton, Styles } = require('material-ui');

const { Colors, getMuiTheme } = Styles;

class Master extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    children: React.PropTypes.object,
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
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
    const darkWhite = Colors.darkWhite;
    return {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: '0',
        color: Colors.lightWhite,
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
    this.props.history.push(link);
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
      <AppCanvas>
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
            Hand crafted with <i className="md md-favorite"></i> by <a style={styles.a} href="http://kayw.me">kayw</a>
          </p>
          {githubButton}
        </FullWidthSection>

      </AppCanvas>
    );
  }
}

module.exports = Master;
