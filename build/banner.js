import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { name, version, author } from '../package.json';
export default function getBanner() {
  const license = readFileSync(resolve(__dirname, '../LICENSE'), { encoding: 'utf-8' });
  const content = `${name} \n@version ${version}\n@author ${author}\n\n${license}`;
  return `/** \n * ${content.replace(/\*\//g, '* /').split('\n').join('\n * ')}\n */`;
}
