# Copilot Instructions

You are to generate a Playwright + TypeScript + BDD (Cucumber) automation framework.  
The framework must support **UI testing** (https://www.saucedemo.com/v1/) and **API testing** (https://fakestoreapi.com).  

---

## Requirements

1. **Framework Design**
   - Use Playwright with TypeScript.
   - Follow SRP (Single Responsibility Principle) and OCP (Open/Closed Principle).
   - Use Page Object Model (POM).
   - Structure code under `src/` with separate modules for UI, API, helpers, fixtures, constants, and utilities.
   - Keep framework modular and scalable so it can be reused across projects.

2. **Folder Structure**

src/
├── pages/ # POM classes
├── api/ # API request/response classes
├── helpers/ # SRP helper classes (e.g., getByPlaceholder, getByRole, etc.)
├── fixtures/ # Fixtures to reduce boilerplate
├── constants/ # URLs, credentials, API endpoints
├── utils/ # Utilities (logger, data readers, report helpers)
├── global-setup.ts # One-time login and session reuse
tests/
├── features/ # BDD feature files
└── step-definitions/ # Step definitions
reports/ # Allure results and reports
docker/ # Dockerfile + docker-compose
.github/workflows/ # GitHub Actions workflows
playwright.config.ts
package.json
tsconfig.json

3. **UI Testing**
- Base URL: `https://www.saucedemo.com/v1/`
- Login once in `global-setup.ts` and reuse the session for all tests.
- Credentials:
  - Username: `standard_user`
  - Password: `secret_sauce`

4. **API Testing**
- Base URL: `https://fakestoreapi.com`
- Build modular request classes (GET, POST, PUT, DELETE).
- Keep request builders reusable.

5. **BDD**
- Use `.feature` files to drive tests.
- Maintain step definitions in `tests/step-definitions`.
- Support tags: `@ui`, `@api`, `@smoke`, `@regression`.

6. **Fixtures**
- Provide browser/page fixtures.
- Provide test data fixtures.
- Reduce boilerplate in tests.

7. **Docker**
- Add `Dockerfile` and `docker-compose.yml` to run tests inside containers.
- Support parallel execution in CI/CD.

8. **Reporting**
- Integrate Allure reporting.
- Save results under `reports/allure-results`.
- Generate report under `reports/allure-report`.

9. **GitHub Actions**
- Workflow file under `.github/workflows/test.yml`.
- Run tests in Docker.
- Generate Allure report.
- Deploy Allure report to GitHub Pages with trend history.

---

## Commands
- Install dependencies: `npm install`
- Run UI tests: `npx cucumber-js tests/features --tags "@ui"`
- Run API tests: `npx cucumber-js tests/features --tags "@api"`
- Run all tests in Docker: `docker-compose up --build`
- Generate Allure report locally:  
```bash
npx allure generate reports/allure-results --clean -o reports/allure-report
npx allure open reports/allure-report


Acceptance Criteria

Framework is modular, reusable, and scalable.

Supports UI + API tests.

Global setup logs in once and reuses session.

Allure reports generated and published to GitHub Pages with trend report.

Runs locally and in Docker.

CI/CD pipeline in GitHub Actions is ready.