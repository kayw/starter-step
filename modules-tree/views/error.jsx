'use strict';
var React = require('react');
module.exports = React.createClass({
  render: function() {
      return (
          <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </head>
            <body>
                <h1>{this.props.message}</h1>
                <h2>{this.props.error.status}</h2>
                <pre>{this.props.error.stack}</pre>
            </body>
          </html>
      );
  }
});
