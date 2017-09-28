import * as constants from './constants';
import { IMap, IOptions, Sitecore } from './models';
import * as utils from './utils';

const buildTemplates = (
  items: IMap<Sitecore.Rainbow.IItem>,
  toClassFunc?: Function,
  toInterfaceFunc?: Function,
  toNamespaceFunc?: Function) => {

  const toClass = toClassFunc !== undefined && toClassFunc instanceof Function
    ? toClassFunc
    : utils.toClass;

  const toInterface = toInterfaceFunc !== undefined && toInterfaceFunc instanceof Function
    ? toInterfaceFunc
    : utils.toInterface;

  const toNamespace = toNamespaceFunc !== undefined && toNamespaceFunc instanceof Function
    ? toNamespaceFunc
    : utils.toNamespace;

  return Object.keys(items)
    .filter(id => items[id].Template === constants.TEMPLATE_TEMPLATE_ID)
    .map((id) => {
      const name = utils.getNameFromPath(items[id].Path);

      // init template
      return <Sitecore.CodeGeneration.ITemplate>{
        ID: id,
        OwnFields: {},
        BaseTemplates: [],
        Path: items[id].Path,
        Name: name,

        ClassName: toClass(name),
        InterfaceName: toInterface(name),
        Namespace: toNamespace(items[id].Path),
      };
    })
    .reduce((templates, template) => {
      templates[template.ID] = template;

      return templates;
    }, {},
  );
};

const buildTemplateFields = (
  templates: IMap<Sitecore.CodeGeneration.ITemplate>,
  items: IMap<Sitecore.Rainbow.IItem>,
  toPropertyFunc?: Function) => {

  const toProperty = toPropertyFunc !== undefined && toPropertyFunc instanceof Function
    ? toPropertyFunc
    : utils.toProperty;

  Object.keys(templates)
    .map(id => templates[id])
    .map((template) => {
      template.OwnFields = Object.keys(items)
        .filter(id => items[id].Template === constants.FIELD_TEMPLATE_ID && items[id].Path.startsWith(template.Path))
        .map(id => items[id])
        .reduce((fields, item) => {
          const name = utils.getNameFromPath(item.Path);

          fields[name] = <Sitecore.CodeGeneration.IField>{
            ID: item.ID,
            Name: name,
            PropertyName: toProperty(name),
            Type: item.SharedFields.find(sharedField => sharedField.Hint === 'Type').Value,
          };

          return fields;
          // tslint:disable-next-line:align
        }, {});
    });

  return templates;
};

const buildBaseTemplates = (templates: IMap<Sitecore.CodeGeneration.ITemplate>, items: IMap<Sitecore.Rainbow.IItem>) => {
  Object.keys(templates)
    .map(id => templates[id])
    .forEach((template) => {
      // get base templates raw field value
      const rawValue = items[template.ID].SharedFields.find(f => f.Hint === '__Base template').Value
        .toLowerCase()
        .replace(/[\{|\}]/g, '')
        .replace(constants.STANDARD_TEMPLATE_ID, '')
        .trim();

      const baseTemplatesIds = rawValue
        .split('\n');

      baseTemplatesIds
        .filter(id => templates[id] != null && templates[id] !== undefined)
        .map(id => template.BaseTemplates.push(templates[id]));
    });

  return templates;
};

const getTemplateInheritedFields = (template: Sitecore.CodeGeneration.ITemplate) => {
  if (template.InheritedFields !== undefined) {
    return template.InheritedFields;
  }

  const inherited = template.BaseTemplates.reduce(
    (fields, baseTemplate) => {
      baseTemplate.InheritedFields = getTemplateInheritedFields(baseTemplate);

      return { ...fields, ...baseTemplate.InheritedFields, ...baseTemplate.OwnFields };
    }, {});

  // remove keys that exists in own fields already
  Object.keys(template.OwnFields).forEach(key => delete inherited[key]);

  template.InheritedFields = inherited;

  return template.InheritedFields;
};

const buildTemplatesInheritedFields = (templates: IMap<Sitecore.CodeGeneration.ITemplate>) => {
  Object.keys(templates)
    .filter(id => templates[id].BaseTemplates.length > 0)
    .map(id => templates[id])
    .map(getTemplateInheritedFields);

  Object.keys(templates)
    .map(id => templates[id])
    .map((template) => {
      template.Fields = { ...template.InheritedFields, ...template.OwnFields };
    });

  return templates;
};

export const builder = (items: IMap<Sitecore.Rainbow.IItem>, options: IOptions): IMap<Sitecore.CodeGeneration.ITemplate> => {
  let results: IMap<Sitecore.CodeGeneration.ITemplate> = {};

  // do something with results
  results = buildTemplates(items, options.ToClass, options.ToInterface, options.ToNamespace);

  // add own fields
  results = buildTemplateFields(results, items);

  // add base templates
  results = buildBaseTemplates(results, items);

  // add own fields
  results = buildTemplatesInheritedFields(results);

  return results;
};
