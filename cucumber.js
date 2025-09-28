module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/step-definitions/**/*.ts', 'tests/support/*.ts'],
    format: ['progress-bar'],
    formatOptions: { snippetInterface: 'async-aware' },
    timeout: 30000
  }
}