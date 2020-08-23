import type { MaybeUndefined } from '@skypilot/common-types';
import { getOrDefault } from './object/getOrDefault';
import { parseFilepaths } from './parseFilepaths';
import type { FileLocationsMap } from './parseFilepaths';
import { readConfigFile } from './readConfigFile';

export type ReadConfigFileOptions = FileLocationsMap;

interface ReadConfigValueGeneralOptions {
  exitOnError?: boolean; // if true, `process.exit(1)` on error
  quiet?: boolean; // if true, send no output to the console on `process.exit(1)`
  required?: boolean; // if true, throw on error if the value is not found
}

interface ReadConfigValueOptions<T> extends ReadConfigValueGeneralOptions {
  defaultValue?: T;
}

type ReadConfigValueFn = <T>(objectPath: string, options?: ReadConfigValueOptions<T>) => MaybeUndefined<T>;

export function readConfigValue<T>(
  configOptions: ReadConfigFileOptions,
  objectPath: string,
  valueOptions?: ReadConfigValueOptions<T>
): MaybeUndefined<T>

/* Given an object defining file locations and an object path, return the value found at that
   first matching object path in those files; if `defaultValue` is specified in the options and
   the object path isn't found, return `defaultValue`; if the `required` option is `true`,
   throw an error if the object path isn't found */
export function readConfigValue<T>(
  configFileOptions: ReadConfigFileOptions,
  objectPath: string,
  options: ReadConfigValueOptions<T> = {}
): MaybeUndefined<T> | ReadConfigValueFn {
  const filepaths = parseFilepaths(configFileOptions)
    .map(pathToFile => readConfigFile({ pathToFile }));

  /* Check each file in succession; as soon as a match is found, return it. */
  for (let i = 0; i < filepaths.length; i += 1) {
    const config = filepaths[i];
    const value = getOrDefault(config, objectPath);
    if (value !== undefined) {
      return value;
    }
  }

  const { defaultValue, exitOnError, quiet, required } = options;
  if (required && defaultValue === undefined) {
    const errorMsg = 'Error!';
    if (exitOnError) {
      if (!quiet) {
        /* eslint-disable-next-line no-console */
        console.error(errorMsg);
      }
      process.exit(1);
    }
    throw new Error(errorMsg);
  }
  return defaultValue;
}

/* Given a set of options, apply them to `readConfigValue` & return a function accepting the remaining args */
export function configureReadConfigValue(
  generalOptions: ReadConfigFileOptions & ReadConfigValueGeneralOptions
): ReadConfigValueFn {
  return <T>(
    objectPath: string, valueOptions: ReadConfigValueOptions<T> = {}
  ): MaybeUndefined<T> => {
    const mergedOptions = {
      ...generalOptions,
      ...valueOptions,
    }
    return readConfigValue<T>(mergedOptions, objectPath, valueOptions);
  }
}
