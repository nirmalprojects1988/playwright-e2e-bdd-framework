import { AllureRuntime } from 'allure-js-commons';
import { CucumberJSAllureFormatter } from 'allure-cucumberjs';

export default class AllureReporter extends CucumberJSAllureFormatter {
  constructor(options: any) {
    // Initialize Allure runtime
    const runtime = new AllureRuntime({ 
      resultsDir: 'reports/allure-results'
    });

    // Call parent constructor
    super(options, runtime, {});

    // Add environment info
    runtime.writeEnvironmentInfo({
      platform: process.platform,
      environment: process.env.NODE_ENV || 'local',
      framework: 'Playwright + Cucumber',
      language: 'TypeScript'
    });
  }
}