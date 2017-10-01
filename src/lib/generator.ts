// import * as fs from 'fs-extra'
// import yaml from 'js-yaml'
// import * as path from 'path'
import { builder } from './builder';
import { IOptions } from './models';
import { reader } from './reader';
import { writer } from './writer';

export const generator = async (options: IOptions): Promise<string>  => {
  // Get Files based on Glob pattern provided
  const files = await reader(options);

  // find all templates, fields, and sections in found yml files
  const templates = builder(files, options);

  // build full full
  await writer(templates, options);

  return 'done';
};
