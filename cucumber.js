module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      'json:reports/cucumber.json'
    ],
    formatOptions: { 
      snippetInterface: 'async-aware'
    },
    paths: ['tests/features/'],
    timeout: 30000
  }
};