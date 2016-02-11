module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'expect'],
    files: [
      // Third-party dependencies
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      // Module files
      'dist/scripts/betsol-ng-intl-tel-input.js',

      // Tests
      'test/**/test-*.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox'],
    singleRun: true
  });
};
