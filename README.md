[![NPM][package-badge]][package]

[![Build Status][travis-badge]][travis-ci]
[![Dependencies Status][dependencies-badge]][dependencies]

[![Node.js version][nodejs-badge]][nodejs]
[![NPM version][npm-badge]][npm]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![PRs Welcome][prs-badge]][prs]

# Rainbow JS CodeGeneration

[![Greenkeeper badge](https://badges.greenkeeper.io/asmagin/rainbow-js-codegeneration.svg)](https://greenkeeper.io/)

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
};

const result = await generator(options);
//...
```
### generate(options)
This method search for files based on pattern provided, read them and construct templates objects. Once processing is done it complies `Handlebars` template and generates C# code.

#### options:
- **`cwd`**: `string` *(required)* - defines a root directory for a `glob` search;
- **`pattern`**: `string|string[]` *(required)* - defines a pattern for  the `glob` search;
- **`templatePath`**: `string` *(default: standard template for `GlassMapper` embedded)* -  path to a `Handlebars` template file that will process templates info.;
- **`Using`**: `string[]` - a list of `using` that should be rendered in the header of the file;
- **`ToClass`**: `function(name:string)` *(default: PascalCase class name)* - overrides a logic that generates class names;
- **`ToInterface`**: `function(name:string)` *(default: class name prepended with 'I')*- overrides a logic that generates interface names;
- **`ToNamespace`**: `function(path:string)` *(default: section of a path excluding `/sitecore/templates` and template name)* - overrides a logic that generates namespace names;
- **`ToProperty`**: `function(name:string)` *(default: PascalCase property name)*- overrides a logic that generates property names from field names;
- **`ToPropertyType`**: `function(type:string, id:string)` *(default: simple mapping to available types in GlassMapper)* - extends logic related to mapping of a fields to C# tpe of a property. If return `undefined` will fall back to default.

#### context
The method will compile provided or embedded template and pass two objects there `templates` and `options`

Sample of a template file:
``` handlebars
#pragma warning disable 1591
#pragma warning disable 0108
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by Rainbow JS CodeGeneration.
//     (https://github.com/asmagin/rainbow-js-codegeneration)
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using Glass.Mapper.Sc.Configuration.Attributes;
using Glass.Mapper.Sc.Configuration;
using Glass.Mapper.Sc.Fields;
using Sitecore.Globalization;
using Sitecore.Data;
using Sitecore.Data.Items;

{{#each options.Using}}using {{this}};\n{{/each}}
{{#each templates}}

namespace {{this.AsNamespace}}
{

  /// <summary>
  /// {{this.AsInterface}} Interface
  /// <para>Path: {{this.Path}}</para>
  /// <para>ID: {{this.ID}}</para>
  /// </summary>
  [SitecoreType(TemplateId="{{this.ID}}")]
  public partial interface {{this.AsInterface}}: {{#each this.BaseTemplates}}{{this.AsInterface}}, {{/each}}IGlassBase
  {
    {{#each this.Fields}}

    /// <summary>
    /// The {{this.PropertyName}} field.
    /// <para>Field Type: {{this.Type}}</para>
    /// <para>Field ID: {{this.ID}}</para>
    /// </summary>
    [SitecoreField("{{this.Name}}")]
    {{{this.AsPropertyType}}} {{this.AsProperty}} {get; set;}
    {{/each}}

  }
}
{{/each}}
```

### Template Helpers
`guid-b`: will convert text to UPPER CASE and wrap in `{` `}`. Could be used to emulate output of `C#` method `.ToString("B")`
``` handlebars
{{guid-b this.ID}}
{{! will return "{00000000-ABCD-0000-0000-000000000000}"}}
```
`guid-d`: will convert text to UPPER CASE. Could be used to emulate output of `C#` method `.ToString("D")`
``` handlebars
{{guid-b this.ID}}
{{! will return "00000000-ABCD-0000-0000-000000000000"}}
```

## Gulp integration
### generationPlugin()
The library provides a Gulp plugin. The plugin will generate code file for each `configuration` file detected. See example below:

``` js
// other imports
var codeGen = require('rainbow-js-codegeneration').generationPlugin;

// code generation task
gulp.task("Generate-Code", function (callback) {
  gulp.src('**/codegeneration.config.js', { base: "./" })
    .pipe(codeGen())
    .pipe(rename(function (path) {
      path.basename = "Templates.Generated";
      path.extname = ".cs"
    }))
    .pipe(gulp.dest('./'))
    .on("end", function () { // will make sure that you wait for generation to finish
      callback();
    });
});
```

### Configuration
Configuration of the library could be provided via JS module. See example below:
``` js
var path = require("path");

module.exports = {
  cwd: path.join(__dirname, '..'),
  pattern: '**/serialization/*.Templates/**/*.yml',
  Using: [ 'System.CodeDom.Compiler' ],
  templatePath: path.join(__dirname, 'codegeneration.tmpl'),
}
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

[package-badge]: https://nodei.co/npm/rainbow-js-codegeneration.png?downloads=true&downloadRank=true&stars=true
[package]: https://npmjs.org/package/rainbow-js-codegeneration

[dependencies-badge]: https://david-dm.org/asmagin/rainbow-js-codegeneration/dev-status.svg
[dependencies]: https://david-dm.org/asmagin/rainbow-js-codegeneration

[nodejs-badge]: https://img.shields.io/badge/node->=%206.9.0-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v6.x/docs/api/

[npm-badge]: https://img.shields.io/badge/npm->=%203.10.8-blue.svg
[npm]: https://docs.npmjs.com/

[travis-badge]: https://travis-ci.org/asmagin/rainbow-js-codegeneration.svg?branch=master
[travis-ci]: https://travis-ci.org/asmagin/rainbow-js-codegeneration

[license]: https://github.com/asmagin/rainbow-js-codegeneration/blob/master/LICENSE

[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs]: http://makeapullrequest.com

[github-watch-badge]: https://img.shields.io/github/watchers/asmagin/rainbow-js-codegeneration.svg?style=social
[github-watch]: https://github.com/asmagin/rainbow-js-codegeneration/watchers

[github-star-badge]: https://img.shields.io/github/stars/asmagin/rainbow-js-codegeneration.svg?style=social
[github-star]: https://github.com/asmagin/rainbow-js-codegeneration/stargazers