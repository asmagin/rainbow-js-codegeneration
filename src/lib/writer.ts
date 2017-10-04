import { writeFileSync } from 'fs';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import { IMap, IOptions, Sitecore } from './models';
import { source } from './template';

export const writer = async (templateMap: IMap<Sitecore.CodeGeneration.ITemplate>, options: IOptions) => {
  let generationTemplate = source;

  if (options.generationTemplatePath != null) {
    const fileContent = fs.readFileSync(options.generationTemplatePath, 'utf-8');
    if (fileContent != null) {
      generationTemplate = fileContent;
    }
  }

  Handlebars.registerHelper('guid-b', (guid) => `{${guid.toUpperCase()}}`);
  Handlebars.registerHelper('guid-d', (guid) => guid.toUpperCase());

  const template = Handlebars.compile(generationTemplate);
  const templates = Object.keys(templateMap).map(key => templateMap[key]);

  const results = template({ templates, options });

  if (options.generateFile) {
    writeFileSync(options.targetPath, results, 'UTF-8');
  }

  return results;
};
