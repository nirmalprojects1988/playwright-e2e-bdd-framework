// NOTE: Ensure there are no 'path' and 'fs' imports here.

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      // CRITICAL FIX: The second item MUST be a simple string path.
      ['./tests/support/allure.setup.ts', '/app/reports/allure-results'] 
    ],
    formatOptions: { 
      snippetInterface: 'async-aware'
    },
    paths: ['tests/features/'],
    timeout: 30000
  }
};
