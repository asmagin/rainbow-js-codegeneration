// import * as fs from 'fs-extra'
// import yaml from 'js-yaml'
// import * as path from 'path'
import { builder } from './builder';
import { IOptions } from './models';
import { reader } from './reader';
import { log } from './utils';
import { writer } from './writer';

export const generator = (options: IOptions): string => {
  // Get Files based on Glob pattern provided
  const start = new Date();
  const files = reader(options);

  // find all templates, fields, and sections in found yml files
  const templates = builder(files, options);

  // build full full
  const result = writer(templates, options);

  const count = Object.keys(templates).length;
  const seconds = (new Date().getTime() - start.getTime()) / 1000;

  log.info(`Code generation for ${count} template(s) finished in ${seconds}s`);

  return result;
};
