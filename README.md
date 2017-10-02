[![Node.js version][nodejs-badge]][nodejs]
[![NPM version][npm-badge]][npm]
[![Build Status][travis-badge]][travis-ci]
[![PRs Welcome][prs-badge]][prs]
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

# Rainbow JS CodeGeneration

## Installation

```
npm i rainbow-js-codegeneration --saveDev
```

## API
---

The module exposes one method `generate` that accepts `options` object as a parameter


``` typescript
import { generator, IOptions } from 'rainbow-js-codegeneration';
//...
const options: IOptions = {
  cwd: path,
  pattern,
  generateFile: true,
  targetPath: './folder/Models.Generated.cs',
};

const result = await generator(options);
//...
```
### generate(options)
This method search for files based on pattern provided, read them and construct templates objects. Once processing is done it complies `Handlebars` template and generates C# code.

#### options:
- **`cwd`**: `string` *(required)* - defines a root directory for a `glob` search;
- **`pattern`**: `string|string[]` *(required)* - defines a pattern for  the `glob` search;
- **`generateFile`**: `boolean` - control, if a file will be written to a filesystem;
- **`targetPath`**: `string` - defines a location of a target file for code generation;
- **`generationTemplatePath`**: `string` *(default: standard template for `GlassMapper` embedded)* -  path to a `Handlebars` template file that will process templates info.;
- **`Using`**: `string[]` - a list of `using` that should be rendered in the header of the file;
- **`ToClass`**: `function(name:string)` *(default: PascalCase class name)* - overrides a logic that generates class names;
- **`ToInterface`**: `function(name:string)` *(default: class name prepended with 'I')*- overrides a logic that generates interface names;
- **`ToNamespace`**: `function(path:string)` *(default: section of a path excluding `/sitecore/templates` and template name)* - overrides a logic that generates namespace names;
- **`ToProperty`**: `function(name:string)` *(default: PascalCase property name)*- overrides a logic that generates propertie names from field names;
- **`ToPropertyType`**: `function(type:string, id:string)` *(default: simple mapping to available types in GlassMapper)* - extends logic related to mapping of a fields to C# tpe of a property. If return `undefined` will fall back to default.

### context
TODO: describe `Handlebars` context and model that is passed

## Gulp integration
The library provides a Gulp plugin. The plugin will generate code file for each `configuration` file detected. See example below:  

``` js
// other imports 
var codeGen = require('d:/.projects/oss/rainbow-js-codegeneration').generationPlugin;

// ...

gulp.task("Generate-Code", function () {
  gulp.src('**/codegeneration.config.js', { base: "./" })
    .pipe(codeGen())
});
```

## Available scripts

+ `clean` - remove coverage data, Jest cache and transpiled files,
+ `build` - transpile TypeScript to ES6,
+ `watch` - interactive watch mode to automatically transpile source files, 
+ `lint` - lint source files and tests,
+ `test` - run tests,
+ `test:watch` - interactive watch mode to automatically re-run tests

## License
Licensed under the MIT. See the [LICENSE](https://github.com/asmagin/rainbow-js-codegeneration/blob/master/LICENSE) file for details.

[dependencies-badge]: https://david-dm.org/asmagin/rainbow-js-codegeneration/dev-status.svg
[dependencies]: https://david-dm.org/asmagin/rainbow-js-codegeneration?type=dev
[nodejs-badge]: https://img.shields.io/badge/node->=%206.9.0-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v6.x/docs/api/
[npm-badge]: https://img.shields.io/badge/npm->=%203.10.8-blue.svg
[npm]: https://docs.npmjs.com/
[travis-badge]: https://travis-ci.org/asmagin/rainbow-js-codegeneration.svg?branch=master
[travis-ci]: https://travis-ci.org/asmagin/rainbow-js-codegeneration
[typescript]: https://www.typescriptlang.org/
[typescript-25]: https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#typescript-25
[license]: https://github.com/asmagin/rainbow-js-codegeneration/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs]: http://makeapullrequest.com
[github-watch-badge]: https://img.shields.io/github/watchers/asmagin/rainbow-js-codegeneration.svg?style=social
[github-watch]: https://github.com/asmagin/rainbow-js-codegeneration/watchers
[github-star-badge]: https://img.shields.io/github/stars/asmagin/rainbow-js-codegeneration.svg?style=social
[github-star]: https://github.com/asmagin/rainbow-js-codegeneration/stargazers
[jest]: https://facebook.github.io/jest/
[tslint]: https://palantir.github.io/tslint/
[tslint-microsoft-contrib]: https://github.com/Microsoft/ttslint-microsoft-contrib
