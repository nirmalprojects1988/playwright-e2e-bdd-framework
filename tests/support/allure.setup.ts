import { CucumberJSAllureFormatter } from 'allure-cucumberjs';
import { AllureRuntime } from 'allure-js-commons';

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options: any) {
    
    // The path is passed as the second string in cucumber.local.js, 
    // which maps it to options.output.
    const resultsPath = options.output || 'reports/allure-results';

    super(
      options, 
      new AllureRuntime({ 
        resultsDir: resultsPath
      }),
      {} 
    );
  }
}
