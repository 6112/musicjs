module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['requirejs', 'qunit'],
    files: [
      'test-main.js',
      { pattern: 'dist/browser/**/*.js', included: false }
    ],
    exclude: [
    ],
    preprocessors: {
      'dist/browser/**/!(*spec).js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    browsers: ['Chrome'],
    singleRun: true,
    browserNoActivityTimeout: 70000,
    coverageReporter: {
      dir: 'dist/coverage',
      includeAllSources: true,
      check: {
        global: {
          statements: 50,
          branches: 50,
          functions: 50,
          lines: 50
        }
      }
    }
  });
};
