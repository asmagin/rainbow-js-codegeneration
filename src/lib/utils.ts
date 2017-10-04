import * as loglevel from 'loglevel';
import { basename } from 'path';

loglevel.setLevel('info');

// if (process.env.DEBUG != null || process.env.debug != null) {
//   loglevel.setLevel('debug');
// }

const toPascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (match) => {
      return match.toUpperCase();
    })
    .replace(/[^a-zA-Z\d]+/g, '');
};

export const toClass = (name: string): string => {
  return toPascalCase(name);
};

export const toProperty = (name: string): string => {
  return toPascalCase(name);
};

export const toInterface = (name: string): string => {
  return `I${toClass(name)}`;
};

export const toNamespace = (path: string): string => {
  const sections = path.split('/');

  return sections
    .slice(3, -1)
    .map(toClass)
    .join('.');
};

export const getNameFromPath = (path) => {
  return basename(path);
};

export const toPropertyType = (name: string): string => {
  switch (name.toLowerCase()) {
    case 'tristate':
      return 'TriState';

    case 'checkbox':
      return 'bool';

    case 'date':
    case 'datetime':
      return 'DateTime';

    case 'number':
      return 'float';

    case 'integer':
      return 'int';

    case 'treelist with search':
    case 'treelist':
    case 'treelistex':
    case 'treelist descriptive':
    case 'checklist':
    case 'multilist with search':
    case 'multilist':
      return 'IEnumerable<Guid>';

    case 'grouped droplink':
    case 'droplink':
    case 'lookup':
    case 'droptree':
    case 'reference':
    case 'tree':
      return 'Guid';

    case 'file':
      return 'File';

    case 'image':
      return 'Image';

    case 'general link':
    case 'general link with search':
      return 'Link';

    case 'password':
    case 'icon':
    case 'rich text':
    case 'html':
    case 'single-line text':
    case 'multi-line text':
    case 'frame':
    case 'text':
    case 'memo':
    case 'droplist':
    case 'grouped droplist':
    case 'valuelookup':
      return 'string';

    case 'attachment':
    case 'word document':
      return 'System.IO.Stream';

    case 'name lookup value list':
    case 'name value list':
      return 'System.Collections.Specialized.NameValueCollection';

    default:
      return `object /* UNKNOWN TYPE: ${name} */`;
  }
};

export const log = loglevel;
