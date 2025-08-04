/**
 * Jest setup file
 * This file runs before each test
 */

// Set test timeout
jest.setTimeout(10000);

// Global test utilities can be added here
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}; 