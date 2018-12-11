// tslint:disable:no-require-imports
// tslint:disable:non-literal-require
import { PluginError } from 'gulp-util';
import * as through from 'through2';
import { generator } from './generator';
import { IOptions } from './models';

const PLUGIN_NAME = 'gulp-rainbow-js-codegeneration';

const contentStream = (text) => {
  const stream = through();
  stream.write(text);

  return stream;
};

const plugin = () => {

  // Creating a stream through which each file will pass
  return through.obj((file, encoding, cb) => {
    if (file.isNull()) {
      // return empty file
      return cb(undefined, file);
    }

    const cfg = <IOptions>require(file.path);

    let content = '';
    try {
      content = generator(cfg);
    } catch (e) {
      return cb(new PluginError(PLUGIN_NAME, e), undefined);
    }

    if (file.isBuffer()) {
      file.contents = new Buffer(content, encoding);
    }
    if (file.isStream()) {
      file.contents = contentStream(content);
    }

    return cb(undefined, file);
  });
};

export const generationPlugin = plugin;
