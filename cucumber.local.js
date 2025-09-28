const path = require('path');
const fs = require('fs');

// FIX: Removed manual directory creation/cleanup logic to resolve EISDIR error.
// The allure reporter or the allure-commandline will handle directory existence.

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      // CRITICAL FIX: Pass the results path as a simple relative string argument.
      ['./tests/support/allure.setup.ts', 'reports/allure-results'] 
    ],
    formatOptions: { 
      snippetInterface: 'async-aware'
    },
    paths: ['tests/features/'],
    timeout: 30000
  }
};
