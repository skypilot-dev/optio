import { MaybeUndefined } from '@skypilot/common-types';
import { getOrDefault } from './object/getOrDefault';
import { readOptionsFile } from './readOptionsFile';

type ReadOptionFunction<T> = (objectPath: string, defaultValue: T) => MaybeUndefined<T>;

interface ReadConfigFilepathOptions {
  configFilepath: string;
  defaultsFilepath?: string;
  overridesFilepath?: string;
}

interface ReadConfigDirOptions {
  configDir: string;
  defaultsDir?: string;
  overridesDir?: string;
  filename: string;
}

type ReadConfigOptions = ReadConfigFilepathOptions | ReadConfigDirOptions;

function generateFilepaths(options: ReadConfigDirOptions): string[] {
  const { configDir, defaultsDir, overridesDir, filename } = options as ReadConfigDirOptions;
  return [configDir, defaultsDir, overridesDir]
    .filter(dir => dir)
    .map(dir => `${dir}/${filename}`);
}

function filterFilepaths(options: ReadConfigFilepathOptions): string[] {
  const { configFilepath, defaultsFilepath, overridesFilepath } = options;
  return [configFilepath, defaultsFilepath, overridesFilepath]
    .filter(filepath => filepath !== undefined)
    .map(filepath => filepath as string);
}

export function parseFilepaths(options: ReadConfigOptions): string[] {
  return Object.prototype.hasOwnProperty.call(options, 'filename')
    ? generateFilepaths(options as ReadConfigDirOptions)
    : filterFilepaths(options as ReadConfigFilepathOptions)
}

/* Return an option from the configs */
export function readOption<T>(
  options: ReadConfigOptions, objectPath: string, defaultValue?: T
): MaybeUndefined<T> {
  const configs = parseFilepaths(options)
    .map(pathToFile => readOptionsFile({ pathToFile }));

  for (let i = configs.length - 1; i >= 0; i -= 1) {
    const config = configs[i];
    const value = getOrDefault<T>(config, objectPath);
    if (value !== undefined) {
      return value as T;
    }
  }
  return defaultValue;
}

/* Given the settings for config files, return a function that accepts an object path and looks it
 * up in the config files. */
export function readOptionFn<T>(options: ReadConfigOptions): ReadOptionFunction<T> {
  return (objectPath: string, defaultValue?: T) => readOption<T>(options, objectPath, defaultValue);
}

