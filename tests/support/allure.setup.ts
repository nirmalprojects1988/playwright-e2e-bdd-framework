import { CucumberJSAllureFormatter } from 'allure-cucumberjs';
import { AllureRuntime } from 'allure-js-commons';

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options: any) {
    super(
      options, 
      new AllureRuntime({ 
        resultsDir: options[1] || 'reports/allure-results' 
      }),
      {}
    );
  }
}