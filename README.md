# Playwright Automation Project

## Overview
This project automates web interactions using Playwright, a powerful browser automation library that supports Chromium, Firefox, and WebKit. It enables end-to-end testing with robust features like parallel execution, headless browsing, and cross-browser support.

## Features
- Cross-browser testing (Chromium, Firefox, WebKit)
- Headless and headed mode execution
- Automated UI testing for web applications
- Screenshot and video capturing for debugging
- Parallel test execution for faster results
- Integration with CI/CD pipelines

## Installation

Ensure you have **Node.js (>=14.0.0)** installed, then follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/AvinashTambe/playwright-automation.git
   ```

2. Navigate into the project directory:
   ```bash
   cd playwright-automation
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Playwright Setup
To install Playwright and its required browsers, run:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in a specific browser
```bash
npx playwright test --browser=chromium
```

### Run a specific test file
```bash
npx playwright test tests/example.spec.ts
```

### Run tests in headed mode (visible browser)
```bash
npx playwright test --headed
```

### Generate Playwright report
```bash
npx playwright show-report
```

## Project Structure
```
📂 playwright-automation
 ├── 📂 tests              # Test scripts
 │   ├── example.spec.ts   # Sample test file
 ├── 📂 utils              # Helper functions
 ├── 📂 reports            # Test execution reports
 ├── playwright.config.ts  # Playwright configuration file
 ├── package.json          # Dependencies and scripts
 ├── README.md             # Project documentation
```

## Configuration
Modify `playwright.config.ts` to adjust test settings such as:
- Browsers (Chromium, Firefox, WebKit)
- Headless mode
- Timeout settings
- Test retries
- Screenshot and video capture options

## CI/CD Integration
Playwright supports integration with GitHub Actions, Jenkins, and other CI/CD tools. Example GitHub Actions workflow:

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm install

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright Tests
        run: npx playwright test
```

## Best Practices
- Keep test cases modular and reusable.
- Use Playwright fixtures for setup and teardown.
- Utilize locators effectively for stable element identification.
- Capture screenshots/videos for debugging failed tests.

## Need Help?
- [Playwright Official Docs](https://playwright.dev/docs/)
- [Playwright GitHub Issues](https://github.com/microsoft/playwright/issues)
- [Playwright Community](https://playwright.dev/community/)

