import { join } from 'path';
import { generator, IOptions } from './main';

describe('Public API', () => {
  const dataPath = join('test-data', 'data', 'sample-1');
  const pattern = '**/serialization/*.Templates/**/*.yml';

  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  test('Generator executes without errors', () => {
    const options: IOptions = {
      cwd: dataPath,
      pattern,
    };

    const result = generator(options);

    expect(result).toEqual(expect.stringMatching(/\[SitecoreType\(TemplateId="b716d128-a28e-4093-a917-d12a1a639ae1"\)\]/));
  });
});
