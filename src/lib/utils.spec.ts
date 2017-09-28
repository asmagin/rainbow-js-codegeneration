import * as utils from './utils';

describe('Utility and helper function', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  // Assert greeter result
  test('getNameFromPath', () => {
    const path = '/sitecore/templates/testYo/Foundation/MyModule/ComplexTemplate/Content/List Field';

    expect(utils.getNameFromPath(path)).toBe('List Field');
  });

  // Assert greeter result
  test('toClass (With spaces)', () => {
    const name = 'List    Field';

    expect(utils.toClass(name)).toBe('ListField');
  });

  // Assert greeter result
  test('toClass (With dashes)', () => {
    const name = 'List -  Field';

    expect(utils.toClass(name)).toBe('ListField');
  });

  // Assert greeter result
  test('toClass (To camel case)', () => {
    const name = 'list field';

    expect(utils.toClass(name)).toBe('ListField');
  });

  // Assert greeter result
  test('toClass (Contains invalid characters)', () => {
    const name = 'list $% % &** ___ field';

    expect(utils.toClass(name)).toBe('ListField');
  });

  // Assert greeter result
  test('toInterface (Contains invalid characters)', () => {
    const name = 'list $% % &** ___ field';

    expect(utils.toInterface(name)).toBe('IListField');
  });

  // Assert greeter result
  test('toNamespace', () => {
    const path = '/sitecore/templates/testYo/Foundation/MyModule/ComplexTemplate/Content/List Field';

    expect(utils.toNamespace(path)).toBe('TestYo.Foundation.MyModule.ComplexTemplate.Content');
  });

  // Assert greeter result
  test('toNamespace (with spaces and dashes)', () => {
    const path = '/sitecore/templates/test Yo/Foundation/My---Module/Complex-Template/Content/List Field';

    expect(utils.toNamespace(path)).toBe('TestYo.Foundation.MyModule.ComplexTemplate.Content');
  });

});
