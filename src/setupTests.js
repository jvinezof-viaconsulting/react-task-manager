import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// Add custom jest matchers
expect.extend({
  // Add your custom matchers here
});

// Global test setup
beforeAll(() => {
  // Your global setup code
});

afterAll(() => {
  // Your global cleanup code
  cleanup();
});
