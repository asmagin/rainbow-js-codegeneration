// import { generator } from './main';

describe('greeter function', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  // Assert greeter result
  test('true == true', () => {
    expect(true).toBe(true);
  });

});
