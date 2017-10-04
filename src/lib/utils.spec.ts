import * as utils from './utils';
import * as loglevel from 'loglevel';

const toNameFormatTestHelper = (func, expected) => {
  const name = func.name;

  test(`${name} (With spaces)`, () => {
    const input = 'List    Field';
    const result = func(input);
    expect(result).toBe(expected);
  });

  // Assert greeter result
  test(`${name} (With dashes)`, () => {
    const input = 'List -  Field';
    const result = func(input);
    expect(result).toBe(expected);
  });

  // Assert greeter result
  test(`${name} (To camel case)`, () => {
    const input = 'list field';
    const result = func(input);
    expect(result).toBe(expected);
  });

  // Assert greeter result
  test(`${name} (Contains invalid characters)`, () => {
    const input = 'list $% % &** ___ field';
    const result = func(input);
    expect(result).toBe(expected);
  });
};

describe('Utils', () => {

  toNameFormatTestHelper(utils.toClass, 'ListField');

  toNameFormatTestHelper(utils.toInterface, 'IListField');

  toNameFormatTestHelper(utils.toProperty, 'ListField');

  test(`${utils.toNamespace.name} (standard path)`, () => {
    const input = '/sitecore/templates/testYo/Foundation/MyModule/ComplexTemplate/Content/List Field';
    const result = utils.toNamespace(input);
    expect(result).toBe('TestYo.Foundation.MyModule.ComplexTemplate.Content');
  });

  test(`${utils.toNamespace.name} (with spaces and dashes)`, () => {
    const input = '/sitecore/templates/test Yo/Foundation/My---Module/Complex-Template/Content/List Field';
    const result = utils.toNamespace(input);
    expect(result).toBe('TestYo.Foundation.MyModule.ComplexTemplate.Content');
  });

  test(`${utils.toNamespace.name} (short path)`, () => {
    const input = '/sitecore';
    const result = utils.toNamespace(input);
    expect(result).toBe('');
  });

  test(`${utils.getNameFromPath.name} (standard path)`, () => {
    const input = '/sitecore/templates/testYo/Foundation/MyModule/ComplexTemplate/Content/List Field';
    const result = utils.getNameFromPath(input);
    expect(result).toBe('List Field');
  });

  test(`${utils.getNameFromPath.name} (with spaces and dashes)`, () => {
    const input = '/sitecore/templates/test Yo/Foundation/My---Module/Complex-Template/Content/List Field';
    const result = utils.getNameFromPath(input);
    expect(result).toBe('List Field');
  });

  [
    { input: 'CheckBox', type: 'bool' },

    { input: 'tristate', type: 'TriState' },

    { input: 'date', type: 'DateTime' },
    { input: 'datetime', type: 'DateTime' },

    { input: 'number', type: 'float' },

    { input: 'integer', type: 'int' },

    { input: 'treelist with search', type: 'IEnumerable<Guid>' },
    { input: 'multilist', type: 'IEnumerable<Guid>' },

    { input: 'reference', type: 'Guid' },

    { input: 'file', type: 'File' },

    { input: 'image', type: 'Image' },

    { input: 'general link', type: 'Link' },

    { input: 'attachment', type: 'System.IO.Stream' },

    { input: 'name lookup value list', type: 'System.Collections.Specialized.NameValueCollection' },

    { input: 'password', type: 'string' },
    { input: 'html', type: 'string' },

    { input: 'LatLong', type: 'object /* UNKNOWN TYPE: LatLong */' },
  ].map(value => {

    test(`${utils.toPropertyType.name} (${value})`, () => {
      const result = utils.toPropertyType(value.input);
      expect(result).toBe(value.type);
    });
  });

  test('Logging', () => {

    const spy = jest.spyOn(loglevel, 'log');
    utils.log.log('test');

    expect(spy).toHaveBeenCalled();

    spy.mockReset();
    spy.mockRestore();
  });

  afterAll(() => {
    process.env.DEBUG = null;
  });

});
