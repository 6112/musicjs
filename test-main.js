const allTestFiles = [];
const TEST_REGEXP = /(spec|test)\.js$/i;

Object.keys(window.__karma__.files).forEach((file) => {
  if (TEST_REGEXP.test(file)) {
    const normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  baseUrl: '/base',
  deps: allTestFiles,
  callback: window.__karma__.start
});
