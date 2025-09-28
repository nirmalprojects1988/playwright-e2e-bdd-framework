# Playwright E2E BDD Framework

A robust end-to-end testing framework built with Playwright, TypeScript, and Cucumber.js. This framework supports both UI testing (SauceDemo) and API testing (Fake Store API) with comprehensive reporting.

## Features

- 🎭 Playwright for browser automation
- 📝 TypeScript for type safety
- 🥒 Cucumber.js for BDD
- 🏗️ Page Object Model design pattern
- 📊 Allure reporting
- 🐳 Docker support
- 🔄 GitHub Actions CI/CD
- 📱 Parallel test execution
- 🔍 UI and API testing support

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/playwright-e2e-bdd-framework.git

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run UI tests
npm run test:ui

# Run API tests
npm run test:api

# Run all tests
npm run test:all

# Run tests in Docker
docker-compose up --build
```

### Test Structure

```
src/
├── pages/      # Page Object Model classes
├── api/        # API request/response classes
├── helpers/    # Helper classes
├── fixtures/   # Test fixtures
├── constants/  # Constants and configuration
├── utils/      # Utility functions
tests/
├── features/   # BDD feature files
└── step-definitions/ # Step definitions
```

### Reports

The framework generates Allure reports after test execution:

```bash
# Generate report
npm run report:generate

# Open report
npm run report:open
```

Reports are also automatically published to GitHub Pages on successful test runs.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.