import { MaybeUndefined } from '@skypilot/common-types';
import { readPackageFile } from '@skypilot/sugarbowl';
import { parsePackageName } from '../common/string/parsePackageName';
import { getOrDefault } from './object/getOrDefault';
import { readConfigFile } from './readConfigFile';

type ReadConfigFunction<T> = (objectPath: string, defaultValue: T) => MaybeUndefined<T>;

interface ReadConfigDirOptions {
  directories: string[];
  filename: string;
}

interface ReadConfigFilepathOptions {
  filepaths: string[];
}

type ReadConfigOptions =  ReadConfigDirOptions | ReadConfigFilepathOptions;

function generateFilepaths(options: ReadConfigDirOptions): string[] {
  const packageName = readPackageFile().name as string;
  const { directory: defaultDirectory, filename: defaultFilename } = parsePackageName(packageName);
  const {
    directories = [defaultDirectory, 'local'],
    filename = defaultFilename,
  } = options as ReadConfigDirOptions;
  return directories.map(dir => `${dir}/${filename}`);
}

export function parseFilepaths(options: ReadConfigOptions): string[] {
  return Object.prototype.hasOwnProperty.call(options, 'filename')
    ? generateFilepaths(options as ReadConfigDirOptions)
    : (options as ReadConfigFilepathOptions).filepaths;
}

/* Return an option from the configs */
export function readConfig<T>(
  options: ReadConfigOptions, objectPath: string, defaultValue?: T
): MaybeUndefined<T> {
  const filepaths = parseFilepaths(options)
    .map(pathToFile => readConfigFile({ pathToFile }));

  for (let i = filepaths.length - 1; i >= 0; i -= 1) {
    const config = filepaths[i];
    const value = getOrDefault<T>(config, objectPath);
    if (value !== undefined) {
      return value as T;
    }
  }
  return defaultValue;
}

/* Given the settings for config files, return a function that accepts an object path and looks it
 * up in the config files. */
export function readConfigFn<T>(options: ReadConfigOptions): ReadConfigFunction<T> {
  return (objectPath: string, defaultValue?: T) => readConfig<T>(options, objectPath, defaultValue);
}
