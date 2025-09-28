module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      // CRITICAL FIX: Use the standard Cucumber JSON formatter. 
      // This is extremely stable and won't throw EISDIR.
      'json:reports/cucumber.json' 
    ],
    formatOptions: { 
      snippetInterface: 'async-aware'
    },
    paths: ['tests/features/'],
    timeout: 30000
  }
};
