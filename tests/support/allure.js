'use strict';

const { AllureRuntime } = require('allure-js-commons');
const { CucumberJSAllureFormatter } = require('allure-cucumberjs');
const fs = require('fs');
const path = require('path');

class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options) {
    const resultsDir = path.resolve(process.cwd(), 'reports/allure-results');
    
    // Ensure directory exists
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const runtime = new AllureRuntime({ resultsDir });
    super(options, runtime, {});
  }
}

module.exports = AllureReporter;