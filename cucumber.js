module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: [
      'progress-bar',
      'allure-cucumberjs:./reports/allure-results'
    ],
    formatOptions: { snippetInterface: 'async-aware' },
    timeout: 30000
  }
}