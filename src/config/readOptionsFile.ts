import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { JsonObject } from '@skypilot/common-types';
import { findPackageFileDir } from '@skypilot/sugarbowl';

interface ReadOptionsFileOptions {
  pathToFile?: string;
}

export function readOptionsFile<T = JsonObject>(options: ReadOptionsFileOptions = {}): T {
  const {
    pathToFile = path.resolve(findPackageFileDir(), '.skypilot/optio.yml'),
  } = options;
  if (fs.existsSync(pathToFile)) {
    const fileContents = fs.readFileSync(pathToFile, { encoding: 'utf-8'} );
    return yaml.safeLoad(fileContents);
  }
  return {} as T;
}
