import { writer } from './writer';

describe('Writer', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  test('TBD', async () => {
    const result = await writer(null, null);

    expect(result).toEqual({ templates: null, options: null });
  });
});
