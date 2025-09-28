import { Before, After, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { AllureRuntime } from 'allure-js-commons';
import { CucumberJSAllureFormatter } from 'allure-cucumberjs';

// Define Allure types
declare global {
  var allureRuntime: AllureRuntime;
}

// Initialize Allure runtime
const resultsDir = './reports/allure-results';
global.allureRuntime = new AllureRuntime({ resultsDir });

// Create custom reporter class
export default class CustomAllureReporter extends CucumberJSAllureFormatter {
  private runtime: AllureRuntime;

  constructor(options: any) {
    const runtime = new AllureRuntime({ resultsDir });
    super(
      options,
      runtime,
      {} // Default user labels
    );
    this.runtime = runtime;
    
    // Write environment info
    this.runtime.writeEnvironmentInfo({
      framework: 'Playwright + Cucumber',
      language: 'TypeScript',
      platform: process.platform,
      environment: process.env.NODE_ENV || 'local'
    });
  }
}

// Track failed scenarios
interface FailedScenario {
  name: string;
  error: string;
  duration: string;
  status: string;
  location: string;
}

let failedScenarios: FailedScenario[] = [];

Before(function(scenario: ITestCaseHookParameter) {
  // No setup needed - runtime already initialized
});

After(async function(scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED) {
    const failedScenario: FailedScenario = {
      name: scenario.pickle.name,
      error: scenario.result.exception?.message || 'Unknown error',
      duration: `${scenario.result.duration.seconds}s`,
      status: scenario.result.status,
      location: scenario.pickle.uri
    };
    
    failedScenarios.push(failedScenario);

    // Write error details
    await global.allureRuntime.writeAttachment(
      'error-details.json',
      JSON.stringify(failedScenario, null, 2),
      'utf8' // Using proper BufferEncoding
    );
  }
});