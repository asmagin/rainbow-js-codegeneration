import { items as simpleData } from '../../test-data/mock/sample-1';
import { items as complexData } from '../../test-data/mock/sample-2';
import { builder } from './builder';
import { IMap, IOptions, Sitecore } from './models';

const options: IOptions = {
  cwd: '', // not used
  pattern: '', // not used
  generateFile: false,
  targetPath: '',
};

const simpleTemplateId = 'b716d128-a28e-4093-a917-d12a1a639ae1';
const complexTemplateId = '8b29bffa-738f-4ec7-9d79-ddfa88006605';

const convertDataToMap = (data, item) => {
  data[item.ID] = item;

  return data;
};

describe('Builder', () => {
  // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
  jest.useFakeTimers();

  // Act before assertions
  beforeAll(async () => {
    // do nothing
  });

  test('Builder executes with empty items array', () => {
    const result = builder({}, options);

    expect(result).toEqual({});
  });

  test('(Simple) Builder executes with not empty items, should return template', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = simpleData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(result[simpleTemplateId]).not.toBeUndefined();
  });

  test('(Simple) Should return MyTemplate', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = simpleData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(result[simpleTemplateId].ID).toEqual(simpleTemplateId);
    expect(result[simpleTemplateId].Name).toEqual('MyTemplate');
    expect(result[simpleTemplateId].Path).toEqual('/sitecore/templates/testYo/Foundation/MyModule/MyTemplate');

  });

  test('(Simple) Should return Text field', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = simpleData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(result[simpleTemplateId].Fields).toHaveLength(2);
  });

  test('Should return complex template', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = complexData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(result[simpleTemplateId]).not.toBeUndefined();
    expect(result[complexTemplateId]).not.toBeUndefined();
  });

  test('Should return complex template with fields', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = complexData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(Object.keys(result[simpleTemplateId].OwnFields)).toHaveLength(2);
    expect(Object.keys(result[complexTemplateId].OwnFields)).toHaveLength(4);
  });

  test('Should return complex template with base templates', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = complexData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(result[simpleTemplateId].BaseTemplates).toHaveLength(0);
    expect(result[complexTemplateId].BaseTemplates).toHaveLength(1);
  });

  test('Should return complex template with inherited fields templates', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = complexData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(result[simpleTemplateId].InheritedFields).toEqual({});
    expect(Object.keys(result[complexTemplateId].InheritedFields)).toHaveLength(1);
  });

  test('Should return property name in for a filed in a complex template', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = complexData.reduce(convertDataToMap, {});

    const result = builder(items, options);

    expect(result[complexTemplateId].Fields).toHaveLength(5);
    expect(result[complexTemplateId].Fields[1].AsProperty).toBe('ListField');
  });

  test('(Simple) custom Class Name', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = simpleData.reduce(convertDataToMap, {});

    const result = builder(items, {
      ...options,
      ToClass: () => 'SomeValue',
    });

    expect(result[simpleTemplateId].AsClass).toBe('SomeValue');
  });

  test('(Simple) custom Interface Name', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = simpleData.reduce(convertDataToMap, {});

    const result = builder(items, {
      ...options,
      ToInterface: () => 'SomeValue',
    });

    expect(result[simpleTemplateId].AsInterface).toBe('SomeValue');
  });

  test('(Simple) custom Interface Name', () => {
    const items: IMap<Sitecore.Rainbow.IItem> = simpleData.reduce(convertDataToMap, {});

    const result = builder(items, {
      ...options,
      ToNamespace: () => 'SomeValue',
    });

    expect(result[simpleTemplateId].AsNamespace).toBe('SomeValue');
  });
});
