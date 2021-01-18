/* eslint-disable @typescript-eslint/ban-types */

import fs from 'fs';
import path from 'path';
import yaml, { JSON_SCHEMA } from 'js-yaml';
import { findPackageFileDir, isObject } from '@skypilot/sugarbowl';

interface ReadConfigFileOptions {
  pathToFile?: string;
}

export function readConfigFile(options: ReadConfigFileOptions = {}): object {
  const {
    pathToFile = path.resolve(findPackageFileDir(), '.skypilot/fauna-tools.yaml'),
  } = options;
  if (fs.existsSync(pathToFile)) {
    const fileContents = fs.readFileSync(pathToFile, { encoding: 'utf-8' } );
    const parsedContents = yaml.load(fileContents, { schema: JSON_SCHEMA });
    if (!isObject(parsedContents)) {
      throw new Error(`Unexpected non-object value read from YAML file: ${parsedContents}`);
    }
    return parsedContents || {};
  }
  return {};
}
