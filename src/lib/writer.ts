import { writeFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { IMap, IOptions, Sitecore } from './models';
import { source } from './template';

export const writer = async (templateMap: IMap<Sitecore.CodeGeneration.ITemplate>, options: IOptions) => {
  // tslint:disable-next-line:strict-boolean-expressions
  const template = Handlebars.compile(options.generationTemplate || source);
  const templates = Object.keys(templateMap).map(key => templateMap[key]);

  const results = template({ templates, options });

  if (options.generateFile) {
    writeFileSync(options.targetPath, results, 'UTF-8');
  }

  return results;
};
