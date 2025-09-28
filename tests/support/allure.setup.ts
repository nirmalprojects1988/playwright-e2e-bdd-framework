import { CucumberJSAllureFormatter } from 'allure-cucumberjs';
import { AllureRuntime } from 'allure-js-commons';

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options: any) {
    
    // CRITICAL FIX: The path is passed as the second string in cucumber.local.js,
    // which automatically maps it to the options.output property.
    const resultsPath = options.output || 'reports/allure-results';

    super(
      options, 
      new AllureRuntime({ 
        resultsDir: resultsPath
      })
      // FIX: Removed the third, empty argument ({}) which often causes the EISDIR conflict
    );
  }
}
