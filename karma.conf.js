// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine-given', 'jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-given'),
      require('karma-chrome-launcher'),
      require('karma-mocha-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-jasmine-diff-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/m-crm'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
      thresholds: {
        global: {
          statements: 70,
          branches: 80,
          functions: 90,
          lines: 80
        }
      }
    },
    reporters: ['jasmine-diff', 'mocha'],
    jasmineDiffReporter: {
      color: {
        expectedBg: 'bgRed',
        expectedWhitespaceBg: 'bgRed',
        expectedFg: 'white',

        actualBg: 'bgGreen',
        actualWhitespaceBg: 'bgGreen',
        actualFg: 'white',

        warningBg: 'bgYellow',
        warningWhitespaceBg: 'bgYellow',
        warningFg: 'white',

        defaultBg: '',
        defaultFg: ''
      },
      pretty: false,
      multiline: false,
      verbose: true,
      matchers: {}
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};

// browsers: ['Chrome'],
