import { join } from 'path';
import { generator } from './generator';
import { IOptions } from './models';

describe('Generator', () => {
  const dataPath = join(__dirname, '..', '..', 'test-data', 'data', 'sample-1');
  const pattern = '**/serialization/*.Templates/**/*.yml';

  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  test('Generator executes without errors', async () => {
    const options: IOptions = {
      cwd: dataPath,
      pattern,
    };

    const result = await generator(options);

    expect(result).toBe('done');
  });
});
