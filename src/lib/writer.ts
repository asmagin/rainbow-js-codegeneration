import { IMap, IOptions, Sitecore } from './models';

export const writer = async (templates: IMap<Sitecore.CodeGeneration.ITemplate>, options: IOptions) => {

  return { templates, options };
};
