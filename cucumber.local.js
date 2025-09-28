module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      // CRITICAL FIX: Pass the class path and the directory path. The formatter 
      // class (AllureReporter) will now correctly parse the path from the options object.
      ['./tests/support/allure.setup.ts', { output: '/app/reports/allure-results' }] 
    ],
    formatOptions: { 
      snippetInterface: 'async-aware'
    },
    paths: ['tests/features/'],
    timeout: 30000
  }
};
