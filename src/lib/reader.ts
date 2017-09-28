// tslint:disable:no-require-imports
// tslint:disable:no-var-requires
const glob = require('glob');

import * as fs from 'fs-extra';
import * as jsYaml from 'js-yaml';
import { join } from 'path';
import { IMap, IOptions, Sitecore } from './models';

/*
  `Reader` module will accept pattern and root folder, read YAML files and return a map of files;
*/
export const reader = async (options: IOptions): Promise<IMap<Sitecore.Rainbow.IItem>> => {
  const paths = await new Promise<string[]>(
    (resolve, reject) => {
      let pattern = options.pattern;

      if (Object.prototype.toString.call(pattern) === '[object Array]') {
        const arr = <string[]>pattern;
        pattern = `{${arr.join(',')}}`;
      }

      glob(
        pattern,
        {
          cwd: options.cwd,
        },
        (err, matches) => {
          if (err || !matches) {
            return reject(err);
          } else if (matches.length === 0) {
            return reject(new Error(`No files were found\n ${JSON.stringify(options, null, '  ')}`));
          } else {
            return resolve(matches);
          }
        });
    },
  );

  const items: IMap<Sitecore.Rainbow.IItem> = { };

  paths.reduce(
    (data, path) => {
      const item: Sitecore.Rainbow.IItem = jsYaml.safeLoad(fs.readFileSync(join(options.cwd, path), 'utf8'));
      data[item.ID] = item;

      return data;
    },
    items,
  );

  return items;
};
