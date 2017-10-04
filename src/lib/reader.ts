// tslint:disable:no-require-imports
// tslint:disable:no-var-requires
const glob = require('glob');

import * as fs from 'fs-extra';
import * as jsYaml from 'js-yaml';
import { join } from 'path';
import { IMap, IOptions, Sitecore } from './models';
import { log } from './utils';

/*
  `Reader` module will accept pattern and root folder, read YAML files and return a map of files;
*/
export const reader = (options: IOptions): IMap<Sitecore.Rainbow.IItem> => {
  let pattern = options.pattern;

  if (Object.prototype.toString.call(pattern) === '[object Array]') {
    const arr = <string[]>pattern;
    pattern = `{${arr.join(',')}}`;
  }

  const items: IMap<Sitecore.Rainbow.IItem> = {};

  try {
    const paths = glob.sync(
      pattern, {
        cwd: options.cwd,
      });

    paths.reduce(
      (data, path) => {
        const item: Sitecore.Rainbow.IItem = jsYaml.safeLoad(fs.readFileSync(join(options.cwd, path), 'utf8'));
        data[item.ID] = item;

        return data;
      },
      items,
    );
  } catch (e) {
    log.warn(e);
  }

  return items;
};
