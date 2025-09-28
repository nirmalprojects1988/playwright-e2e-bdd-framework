import fs from 'fs';
import path from 'path';
import { Allure } from 'allure-js-commons';
import { Status } from 'allure-js-commons';
import { Page } from '@playwright/test';
import { CustomWorld } from '../../tests/support/world';

type TestData = Record<string, any>;

interface APIResponse<T = any> {
  status: number;
  headers: Record<string, string>;
  body: T;
}

export class TestUtils {
  private static allure = Allure.prototype;

  /**
   * Load test data from JSON fixture file
   */
  static loadTestData<T extends TestData>(filename: string): T {
    try {
      const filePath = path.join(process.cwd(), 'src/fixtures', filename);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Test data file not found: ${filename}`);
      }
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
      throw new Error(`Error loading test data: ${(error as Error).message}`);
    }
  }

  /**
   * Save test data to JSON fixture file
   */
  static saveTestData(filename: string, data: TestData): void {
    try {
      const fixturesDir = path.join(process.cwd(), 'src/fixtures');
      if (!fs.existsSync(fixturesDir)) {
        fs.mkdirSync(fixturesDir, { recursive: true });
      }
      const filePath = path.join(fixturesDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error saving test data: ${(error as Error).message}`);
    }
  }

  /**
   * Take screenshot and attach to Allure report
   */
  static async attachScreenshot(
    world: CustomWorld,
    name: string = 'Screenshot',
    fullPage: boolean = false
  ): Promise<void> {
    try {
      const screenshot = await world.page.screenshot({ 
        fullPage,
        type: 'png'
      });
      await TestUtils.allure.attachment(name, screenshot, 'image/png');
    } catch (error) {
      console.error('Failed to attach screenshot:', error);
    }
  }

  /**
   * Attach API response to Allure report
   */
  static async attachApiResponse<T>(
    name: string,
    response: APIResponse<T>
  ): Promise<void> {
    try {
      const formattedResponse = {
        status: response.status,
        headers: response.headers,
        body: response.body
      };
      await TestUtils.allure.attachment(
        name,
        JSON.stringify(formattedResponse, null, 2),
        'application/json'
      );
    } catch (error) {
      console.error('Failed to attach API response:', error);
    }
  }

  /**
   * Log a step in Allure report with status
   */
  static async logStep(
    message: string,
    status: Status = Status.PASSED
  ): Promise<void> {
    await TestUtils.allure.step(message, async () => {
      return { status };
    });
  }

  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(
    page: Page,
    timeout: number = 5000
  ): Promise<void> {
    try {
      await page.waitForLoadState('networkidle', { timeout });
    } catch (error) {
      throw new Error(`Network did not become idle: ${(error as Error).message}`);
    }
  }

  /**
   * Wait for multiple conditions
   */
  static async waitForConditions(
    page: Page,
    conditions: Array<() => Promise<void>>,
    timeout: number = 5000
  ): Promise<void> {
    const timeoutError = new Error(`Conditions not met within ${timeout}ms`);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(timeoutError), timeout);
    });

    try {
      await Promise.race([
        Promise.all(conditions.map(condition => condition())),
        timeoutPromise
      ]);
    } catch (error) {
      throw new Error(`Failed waiting for conditions: ${(error as Error).message}`);
    }
  }

  /**
   * Generate random test data
   */
  static generateTestData(template: TestData): TestData {
    const result: TestData = {};
    for (const [key, value] of Object.entries(template)) {
      if (typeof value === 'string') {
        result[key] = this.generateRandomString(value);
      } else if (typeof value === 'number') {
        result[key] = Math.floor(Math.random() * value);
      } else if (Array.isArray(value)) {
        result[key] = value[Math.floor(Math.random() * value.length)];
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Generate random string based on pattern
   * Patterns: [A-Z], [a-z], [0-9], [special]
   */
  static generateRandomString(pattern: string): string {
    const charset = {
      'A-Z': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      'a-z': 'abcdefghijklmnopqrstuvwxyz',
      '0-9': '0123456789',
      'special': '!@#$%^&*()_+'
    };

    return pattern.replace(/\[([^\]]+)\]/g, (_, match) => {
      const chars = charset[match as keyof typeof charset] || match;
      return chars.charAt(Math.floor(Math.random() * chars.length));
    });
  }

  /**
   * Clean up test data
   */
  static cleanupTestData(pattern: string): void {
    try {
      const fixturesDir = path.join(process.cwd(), 'src/fixtures');
      const files = fs.readdirSync(fixturesDir);
      for (const file of files) {
        if (file.match(pattern)) {
          fs.unlinkSync(path.join(fixturesDir, file));
        }
      }
    } catch (error) {
      console.error('Failed to cleanup test data:', error);
    }
  }

  /**
   * Format date for test data
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Compare API responses
   */
  static compareApiResponses<T>(
    actual: APIResponse<T>,
    expected: Partial<APIResponse<T>>,
    options: { ignoreHeaders?: boolean } = {}
  ): boolean {
    // Compare status
    if (expected.status && actual.status !== expected.status) {
      return false;
    }

    // Compare headers if not ignored
    if (!options.ignoreHeaders && expected.headers) {
      for (const [key, value] of Object.entries(expected.headers)) {
        if (actual.headers[key] !== value) {
          return false;
        }
      }
    }

    // Compare body if provided
    if (expected.body) {
      return JSON.stringify(actual.body) === JSON.stringify(expected.body);
    }

    return true;
  }
}