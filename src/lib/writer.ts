import * as sort from 'array-sort';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';

import { IMap, IOptions, Sitecore } from './models';
import { source } from './template';

export const writer = (templateMap: IMap<Sitecore.CodeGeneration.ITemplate>, options: IOptions) => {
  let generationTemplate = source;

  if (options.templatePath !== undefined) {
    //tslint:disable-next-line:non-literal-fs-path
    const fileContent = fs.readFileSync(options.templatePath, 'utf-8');
    if (fileContent !== undefined) {
      generationTemplate = fileContent;
    }
  }

  Handlebars.registerHelper('guid-b', (guid) => `{${guid.toUpperCase()}}`);
  Handlebars.registerHelper('guid-d', (guid) => guid.toUpperCase());

  const template = Handlebars.compile(generationTemplate);
  let templates = Object.keys(templateMap)
    .map((key) => {
      const tmp = templateMap[key];
      tmp.Fields = sort(tmp.Fields, 'Name');

      return tmp;
    });

  templates = sort(templates, 'Name');

  return template({ templates, options });
};
