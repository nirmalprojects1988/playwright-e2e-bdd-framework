import { CucumberJSAllureFormatter } from 'allure-cucumberjs';
import { AllureRuntime } from 'allure-js-commons';

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options: any) {
    // CRITICAL FIX: When passing a string in the second array slot from cucumber.local.js,
    // the value is automatically mapped to the 'output' property in the options object.
    const resultsPath = options.output || 'reports/allure-results';

    super(
      options, 
      new AllureRuntime({ 
        // Initialize the runtime with the path
        resultsDir: resultsPath
      }),
      {}
    );
  }
}
