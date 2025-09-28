import { CucumberJSAllureFormatter } from 'allure-cucumberjs';
import { AllureRuntime } from 'allure-js-commons';

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options: any) {
    
    // CRITICAL FIX: The directory path is included as part of the options object,
    // usually in the 'output' property or a specific property if defined in cucumber.local.js.
    // Based on how you called it, we are using the entire options.output string.
    
    // In the standard Allure configuration, the custom reporter receives the
    // output path string as the first item after the reporter path.
    // We assume the path is the ENTIRE options.output string passed from Cucumber.

    // If options.output is the path, use it. If not, use the fallback.
    const resultsPath = options.output || 'reports/allure-results';

    super(
      options, 
      new AllureRuntime({ 
        // The correct property for the runtime is resultsDir
        resultsDir: resultsPath
      }),
      {}
    );
  }
}
