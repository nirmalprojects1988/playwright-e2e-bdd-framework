module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress',
      'allure-cucumberjs'
    ],
    formatOptions: { 
      snippetInterface: 'async-aware',
      'allure-cucumberjs': {
        resultsDir: 'reports/allure-results'
      }
    },
    timeout: 30000
  }
}