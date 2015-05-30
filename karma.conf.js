module.exports = {
  // base path, that will be used to resolve files and exclude
  basePath: '.',

  frameworks: ['mocha', 'chai'],

  // list of files / patterns to load in the browser
  files: [
    'build/test/app.js'
  ],

  // List of files to exclude.
  // exclude: [
  //   'client/javascript/initialize.js'
  // ],

  // Add preprocessors.
  preprocessors: {
  // source files, that you wanna generate coverage for
  // do not include tests or libraries
  // (these files will be instrumented by Istanbul)
    'client/**/*.coffee': ['coverage']
  },

  // use dots reporter, as travis terminal does not support escaping sequences
  // possible values: 'dots', 'progress'
  // CLI --reporters progress
  reporters: ['mocha', 'coverage'],

  // web server port
  // CLI --port 9876
  port: 9876,

  // enable / disable colors in the output (reporters and logs)
  // CLI --colors --no-colors
  colors: true,

  // enable / disable watching file and executing tests whenever any file changes
  // CLI --auto-watch --no-auto-watch
  autoWatch: true,

  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera
  // - Safari (only Mac)
  // - PhantomJS
  // - IE (only Windows)
  // CLI --browsers Chrome,Firefox,Safari
  // browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
  browsers: ['PhantomJS'],

  // If browser does not capture in given timeout [ms], kill it
  // CLI --capture-timeout 5000
  captureTimeout: 20000,

  // Auto run tests on start (when browsers are captured) and exit
  // CLI --single-run --no-single-run
  singleRun: false,
  // optionally, configure the reporter
  coverageReporter: {
  type : 'text',
    dir : 'coverage/'
  },

  // report which specs are slower than 500ms
  // CLI --report-slower-than 500
  reportSlowerThan: 500,

  plugins: [
    'karma-mocha',
    'karma-chai',
    'karma-coverage',
    'karma-phantomjs-launcher',
    'karma-mocha-reporter',
  ]
};
