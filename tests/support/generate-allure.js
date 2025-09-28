const fs = require('fs');
const path = require('path');
const { AllureRuntime } = require('allure-js-commons');

// Create Allure runtime
const resultsDir = path.resolve(process.cwd(), 'reports/allure-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

const runtime = new AllureRuntime({ resultsDir });

// Write environment info
const envInfo = {
  framework: 'Playwright + Cucumber',
  language: 'TypeScript',
  platform: process.platform,
  environment: process.env.NODE_ENV || 'local'
};

fs.writeFileSync(
  path.join(resultsDir, 'environment.properties'),
  Object.entries(envInfo)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
);

// Read Cucumber JSON results
const cucumberJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'reports/cucumber.json'), 'utf8')
);

// Process each feature
cucumberJson.forEach(feature => {
  feature.elements.forEach(scenario => {
    // Create test result file
    const uuid = Math.random().toString(36).substring(2);
    const testResult = {
      name: scenario.name,
      fullName: `${feature.name}: ${scenario.name}`,
      historyId: uuid,
      testCaseId: uuid,
      status: 'passed',
      statusDetails: {},
      stage: 'finished',
      steps: scenario.steps.map(step => ({
        name: step.keyword + step.name,
        status: step.result.status.toUpperCase(),
        stage: 'finished',
        start: Date.now(),
        stop: Date.now() + (step.result.duration || 0)
      })),
      labels: [
        { name: 'feature', value: feature.name },
        { name: 'framework', value: 'Cucumber' },
        ...scenario.tags.map(tag => ({ 
          name: 'tag', 
          value: tag.name.replace('@', '') 
        }))
      ],
      start: Date.now(),
      stop: Date.now()
    };

    // Handle failures
    if (scenario.steps.some(step => step.result.status === 'failed')) {
      const failedStep = scenario.steps.find(step => step.result.status === 'failed');
      testResult.status = 'failed';
      testResult.statusDetails = {
        message: failedStep.result.error_message,
        trace: failedStep.result.error_message
      };

      // Add error attachment
      const attachmentPath = path.join(resultsDir, `${uuid}-error.txt`);
      fs.writeFileSync(attachmentPath, failedStep.result.error_message);
    }

    // Save test result
    fs.writeFileSync(
      path.join(resultsDir, `${uuid}-result.json`),
      JSON.stringify(testResult, null, 2)
    );
  });
});