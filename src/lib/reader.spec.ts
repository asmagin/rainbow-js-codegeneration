import { join } from 'path';
import { reader } from './reader';

describe('Reader', () => {
  const dataPath = join(__dirname, '..', '..', 'test-data', 'data', 'sample-1');
  const pattern = '**/serialization/*.Templates/**/*.yml';

  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  test('Find .yml files based on a pattern', () => {
    const files = reader({
      cwd: dataPath,
      pattern,
    });

    expect(typeof (files)).not.toBe('undefined');
    expect(typeof (files)).not.toBe('null');
    expect(typeof (files)).toBeTruthy();
    expect(Object.keys(files)).toHaveLength(5);
  });

  test('Find .yml files based on an array of patterns', () => {
    const files = reader({
      cwd: dataPath,
      pattern: [pattern, '**/serialization/*.Settings/**/*.yml'],
    });

    expect(typeof (files)).not.toBe('undefined');
    expect(typeof (files)).not.toBe('null');
    expect(typeof (files)).toBeTruthy();
    expect(Object.keys(files)).toHaveLength(6);
  });

  test('Find .yml files based on an array of patterns (alternative cwd & template)', () => {
    const files = reader({
      cwd: join(dataPath, 'serialization'),
      pattern: '**/*.Templates/**/*.yml',
    });

    expect(typeof (files)).not.toBe('undefined');
    expect(typeof (files)).not.toBe('null');
    expect(typeof (files)).toBeTruthy();
    expect(Object.keys(files)).toHaveLength(5);
  });

  test('Read content of .yml', () => {
    const files = reader({
      cwd: dataPath,
      pattern: [pattern, '**/serialization/*.Settings/**/*.yml'],
    });

    expect(files['969b1f2e-b070-460f-9770-3d40b94a2119']).toBeTruthy();
    expect(files['969b1f2e-b070-460f-9770-3d40b94a2119'].ID).toBe('969b1f2e-b070-460f-9770-3d40b94a2119');
  });
});
