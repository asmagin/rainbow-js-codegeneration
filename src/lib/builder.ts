import * as constants from './constants';
import { IMap, IOptions, Sitecore } from './models';
import * as utils from './utils';

const buildTemplates = (
  items: IMap<Sitecore.Rainbow.IItem>,
  toClassFunc?: Function,
  toInterfaceFunc?: Function,
  toNamespaceFunc?: Function,
) => {
  const toClass = toClassFunc !== undefined && toClassFunc instanceof Function ? toClassFunc : utils.toClass;

  const toInterface =
    toInterfaceFunc !== undefined && toInterfaceFunc instanceof Function ? toInterfaceFunc : utils.toInterface;

  const toNamespace =
    toNamespaceFunc !== undefined && toNamespaceFunc instanceof Function ? toNamespaceFunc : utils.toNamespace;

  return Object.keys(items)
    .filter((id) => items[id].Template === constants.TEMPLATE_TEMPLATE_ID)
    .map((id) => {
      const name = utils.getNameFromPath(items[id].Path);

      // init template
      // const template:Sitecore.CodeGeneration.ITemplate
      return {
        ID: id,
        OwnFields: {},
        BaseTemplates: [],
        Path: items[id].Path,
        Name: name,

        AsClass: toClass(name),
        AsInterface: toInterface(name),
        AsNamespace: toNamespace(items[id].Path),
      };
    })
    .reduce((templates, template) => {
      templates[template.ID] = template;

      return templates;
    }, {});
};

const buildTemplateFields = (
  templates: IMap<Sitecore.CodeGeneration.ITemplate>,
  items: IMap<Sitecore.Rainbow.IItem>,
  toPropertyFunc?: Function,
  toPropertyTypeFunc?: Function,
) => {
  const toProperty =
    toPropertyFunc !== undefined && toPropertyFunc instanceof Function ? toPropertyFunc : utils.toProperty;

  const toPropertyType =
    toPropertyTypeFunc !== undefined && toPropertyTypeFunc instanceof Function
      ? // tslint:disable-next-line:strict-boolean-expressions
        (name, id?) => toPropertyTypeFunc(name, id) || utils.toPropertyType(name)
      : utils.toPropertyType;

  Object.keys(templates)
    .map((id) => templates[id])
    .map((template) => {
      template.OwnFields = Object.keys(items)
        .filter(
          (id) => items[id].Template === constants.FIELD_TEMPLATE_ID && items[id].Path.startsWith(`${template.Path}/`),
        )
        .map((id) => items[id])
        .reduce((fields, item) => {
          const name = utils.getNameFromPath(item.Path);
          const fieldType = item.SharedFields.find((sharedField) => sharedField.Hint === 'Type').Value;

          fields[name] = {
            ID: item.ID,
            Name: name,
            AsProperty: toProperty(name),
            AsPropertyType: toPropertyType(fieldType, item.ID),
            Type: fieldType,
          };

          return fields;
        }, {});
    });

  return templates;
};

const buildBaseTemplates = (
  templates: IMap<Sitecore.CodeGeneration.ITemplate>,
  items: IMap<Sitecore.Rainbow.IItem>,
) => {
  Object.keys(templates)
    .map((id) => templates[id])
    .forEach((template) => {
      const rawValue = (
        // tslint:disable-next-line:no-object-literal-type-assertion strict-boolean-expressions
        ((items[template.ID].SharedFields || []).find((f) => f.Hint === '__Base template') || <Sitecore.Rainbow.IField>{}).Value || ''
      )
        .toLowerCase()
        .replace(/[\{|\}]/g, '')
        .replace(constants.STANDARD_TEMPLATE_ID, '')
        .trim();

      const baseTemplatesIds = rawValue.split('\n');

      baseTemplatesIds
        .filter((id) => templates[id] !== undefined && templates[id] !== undefined)
        .map((id) => template.BaseTemplates.push(templates[id]));
    });

  return templates;
};

const getTemplateInheritedFields = (template: Sitecore.CodeGeneration.ITemplate) => {
  if (template.InheritedFields !== undefined) {
    return template.InheritedFields;
  }

  const inherited = template.BaseTemplates.reduce((fields, baseTemplate) => {
    baseTemplate.InheritedFields = getTemplateInheritedFields(baseTemplate);

    return {
      ...fields,
      ...baseTemplate.InheritedFields,
      ...baseTemplate.OwnFields,
    };
  }, {});

  // remove keys that exists in own fields already
  Object.keys(template.OwnFields)
    // tslint:disable-next-line:no-dynamic-delete
    .forEach((key) => delete inherited[key]);

  template.InheritedFields = inherited;

  return template.InheritedFields;
};

const buildTemplatesInheritedFields = (templates: IMap<Sitecore.CodeGeneration.ITemplate>) => {
  Object.keys(templates)
    .filter((id) => templates[id].BaseTemplates.length > 0)
    .map((id) => templates[id])
    .map(getTemplateInheritedFields);

  Object.keys(templates)
    .map((id) => templates[id])
    .map((template) => {
      const fields = { ...template.InheritedFields, ...template.OwnFields };
      template.Fields = Object.keys(fields)
        .map((id) => fields[id]);
    });

  return templates;
};

export const builder = (
  items: IMap<Sitecore.Rainbow.IItem>,
  options: IOptions,
): IMap<Sitecore.CodeGeneration.ITemplate> => {
  let results: IMap<Sitecore.CodeGeneration.ITemplate> = {};

  // build templates
  results = buildTemplates(items, options.ToClass, options.ToInterface, options.ToNamespace);

  // add own fields
  results = buildTemplateFields(results, items, options.ToProperty, options.ToPropertyType);

  // add base templates
  results = buildBaseTemplates(results, items);

  // add inherited fields
  results = buildTemplatesInheritedFields(results);

  return results;
};
