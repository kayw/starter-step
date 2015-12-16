import render, { renderOldPage } from '../../universal/html-render';
import debug from '../../universal/helpers/inspector';

module.exports = function makeRenderRouteMiddleware(middleware) {
  return function *renderRoute(next) {
    function *renderRouteMiddleware() {
      let initialState = {};
      if (typeof middleware === 'function') {
        initialState = yield middleware.call(this, `/api${this.request.url}`, this.request.method);
      }
      try {
        this.body = yield render(this.request.url, initialState);
      } catch (e) {
        debug('renderRouteMiddleware:', e.stack || e);
        yield* next;
      }
    }
    function *renderPlayground() {
      debug('renderplayground');
      const htmls = renderOldPage();
      this.body = `
      <!DOCTYPE html>
      <!--[if IE 8]><html class="no-js lt-ie9" lang="en" > <![endif]-->
      <!--[if gt IE 8]><!--> <html class="no-js" lang="en" > <!--<![endif]-->
      <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <title>Playground</title>
      <link rel="stylesheet" href="/css/sphinx_rtd_theme.css" type="text/css" />
      <link rel="stylesheet" href="/css/play-container.css" type="text/css" />
      <script src="/js/jquery.min.js" type="text/javascript" charset="utf-8"></script>
      <script src="/js/jquery-linedtextarea.js" type="text/javascript"></script>
      <script src="/js/playground.js" type="text/javascript"></script>
      <script src="/js/play-container.js" type="text/javascript" charset="utf-8"></script>
      </head>
      <body class="sv-body-for-nav sv-nav-enabled">
        <div class="sv-nav-viewport">
          <nav class="sv-nav-side stickynav" data-toggle="sv-nav-shift">
            <div class="sv-nav-side-home">
              <a class="fa fa-home" href="#"> demo </a>
            </div>
            <div class="sv-menu sv-menu-vertical" role="navigation">
              <ul>
                <li><a href="/play">Play</a></li> <!-- current -->
                <li><a href="/saviour">viewer&editor</a></li>
              </ul>
            </div>
          </nav>
          <section class="sv-nav-content-wrap" data-toggle="sv-nav-shift">
            <div class="sv-nav-header">
              <a id="mw-mf-main-menu-button" class="icon icon-mainmenu" title="Open main menu">Open main menu</a>
              <form class="search-box" action="/search">
                <input id="searchInput" class="search" type="search" autocomplete="off" accesskey="f" title="Search [f]" placeholder="Search Saviour" name="search" readonly="">
                <input class="fulltext-search no-js-only icon icon-search" type="submit" title="Search within code" value="Search" name="fulltext">
              </form>
            </div>
            <div id="content-container">${htmls}</div>
            <footer>
              <hr>
              <ul>
                <li> kayw @2015 </li>
                <li>
                  <a class="external" href="http://mit-license.org" rel="nofollow"> MIT licence</a>
                </li>
              </ul>
              <ul>
                Content is available under <a class="external" href="//creativecommons.org/licenses/by-sa/3.0/" rel="nofollow">CC BY-SA 3.0</a> unless otherwise noted.
              </ul>
              <ul>
                Built with
                <a href="https://github.com/snide/sphinx_rtd_theme">theme</a>
                provided by
                <a href="https://readthedocs.org">Read the Docs</a>
                .
              </ul>
            </footer>
          </section>
        </div>
      </body>
      </html>`;
    }
    console.log(this.request.get('user-agent'));
    global.navigator = {};
    navigator.userAgent = this.request.get('user-agent');
    if (this.request.url === '/old') {
      yield renderPlayground;
    } else {
      yield renderRouteMiddleware;
      // yield* renderRouteMiddleware; //not entered
      // yield renderRouteMiddleware(); // this null ??
      // yield* renderRouteMiddleware(); // this null
    }
  };
};
