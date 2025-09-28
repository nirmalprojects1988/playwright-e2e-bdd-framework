const path = require('path');
const fs = require('fs');

// We rely on the allure setup file to handle the directory path correctly.
// Removed all manual FS logic to prevent conflicts.

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      // CRITICAL FIX: Use the absolute path inside the container
      ['./tests/support/allure.setup.ts', '/app/reports/allure-results'] 
    ],
    formatOptions: { 
      snippetInterface: 'async-aware'
    },
    paths: ['tests/features/'],
    timeout: 30000
  }
};
