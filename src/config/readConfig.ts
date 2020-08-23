import { MaybeUndefined } from '@skypilot/common-types';
import { parseFilepaths } from './parseFilepaths';
import type { FileLocationsMap } from './parseFilepaths';
import { getOrDefault } from './object/getOrDefault';
import { readConfigFile } from './readConfigFile';

type ReadConfigOptions = FileLocationsMap;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReadConfigFunction = <T>(objectPath: string, defaultValue?: T) => MaybeUndefined<T>;

/* Return an option from the configs */
export function readConfig<T>(options: ReadConfigOptions, objectPath: string): T | undefined;
export function readConfig<T>(options: ReadConfigOptions, objectPath: string, defaultValue: T): T;

/* @deprecated Use `readConfigValue` instead */
export function readConfig<T>(
  options: ReadConfigOptions, objectPath: string, defaultValue?: T
): MaybeUndefined<T> {
  const filepaths = parseFilepaths(options)
    .map(pathToFile => readConfigFile({ pathToFile }));

  /* Check each file in succession; as soon as a match is found, return it. */
  for (let i = 0; i < filepaths.length; i += 1) {
    const config = filepaths[i];
    const value = getOrDefault(config, objectPath);
    if (value !== undefined) {
      return value;
    }
  }
  return defaultValue;
}

/* Given the settings for config files, return a function that accepts an object path and looks it
 * up in the config files. */
/* @deprecated Use `configureReadConfigValue` instead */
export function readConfigFn(options: ReadConfigOptions): ReadConfigFunction {
  return <T>(objectPath: string, defaultValue?: T) => {
    if (defaultValue === undefined) {
      return readConfig<T>(options, objectPath);
    }
    return readConfig<T>(options, objectPath, defaultValue);
  }
}
