// tslint:disable:no-require-imports
// tslint:disable:non-literal-require
import * as through from 'through2';
import { generator } from './generator';
import { IOptions } from './models';

export const generationPlugin = () => {
  return through.obj((file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }

    const cfg = <IOptions>require(file.path);

    try {
      file.contents = new Buffer(generator(cfg));
      callback(null, file);
    } catch (e) {
      callback(e, null);
    }

    // TSLint hack to keep signature required for gulp plugin
    // tslint:disable-next-line:no-unused-expression
    encoding;
  });
};
