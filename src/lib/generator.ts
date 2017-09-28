// import * as fs from 'fs-extra'
// import yaml from 'js-yaml'
// import * as path from 'path'
import { builder } from './builder';
import { IOptions } from './models';
import { reader } from './reader';

export const generator = async (options: IOptions): Promise<string>  => {
  // Get Files based on Glob pattern provided
  const files = await reader(options);

  // find all templates, fields, and sections in found yml files
  const templates = builder(files, options);
  // build full full

  // tslint:disable-next-line:no-console
  console.log(JSON.stringify(templates, null, ' '));

  return 'done';
};
