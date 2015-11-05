import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
// const cdn = '//cdnjs.cloudflare.com/ajax/libs/';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output in renderer
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.object,
    store: PropTypes.object
  }
/*

    <html>
    {/* https://nemisj.com/conditional-ie-comments-in-react-js/ }
    <head dangerouslySetInnerHTML={{__html: `
       <!-- ... -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
      <![endif]-->`}}
      >

    </head>
    </html>
      */
  render() {
    const {assets, component, store} = this.props;
    const content = ReactDOM.renderToString(component);
    return (
      <html>
        <head>
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="initial-scale=1.0, width=device-width" name="viewport" />
          <meta charSet="UTF-8" />
          <title>Gu-IDE</title>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link href="/statics/main.css" rel="stylesheet" />
          <link href="/statics/material-design-iconic-font/css/material-design-iconic-font.min.css" rel="stylesheet" />

          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, i) =>
            <link href={assets.styles[style]} key={i} rel="stylesheet" type="text/css"/>
          )}
        </head>
        <body>
          <div id="mount" dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${serialize(store.getState())};`}} />
          <script src={assets.javascript.vendor}/>
          <script src={assets.javascript.app}/>
          {/*
            Object.keys(assets.javascript).map((script, i) =>
            <script src={assets.javascript[script]} key={i}/>
          )
          */}
        </body>
      </html>
    );
  }
}
