const path = require('path');
const fs = require('fs');

// Create results directory
const resultsDir = path.join(process.cwd(), 'reports', 'allure-results');
if (fs.existsSync(resultsDir)) {
  fs.rmSync(resultsDir, { recursive: true, force: true });
}
fs.mkdirSync(resultsDir, { recursive: true });

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      ['./tests/support/allure.setup.ts', resultsDir]
    ],
    formatOptions: { 
      snippetInterface: 'async-aware'
    },
    paths: ['tests/features/'],
    timeout: 30000
  }
};