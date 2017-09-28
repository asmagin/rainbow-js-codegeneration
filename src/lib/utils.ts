import { basename } from 'path';

const toPascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (match) => {
      return match.toUpperCase();
    })
    .replace(/[^a-zA-Z\d]+/, '');
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
