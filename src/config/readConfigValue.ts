import path from 'path';
import type { MaybeUndefined } from '@skypilot/common-types';
import { inflectByNumber } from '@skypilot/sugarbowl';
import { getOrDefault } from './object/getOrDefault';
import { parseFilepaths } from './parseFilepaths';
import type { FileLocationsMap } from './parseFilepaths';
import { readConfigFile } from './readConfigFile';

interface ReadConfigValueGeneralOptions {
  ignoreEmpty?: boolean; // if true, empty string values are considered missing (undefined) even if the key is found
  exitOnError?: boolean; // if true, `process.exit(1)` on error
  quiet?: boolean; // if true, send no output to the console on `process.exit(1)`
}

interface ReadConfigValueOptions<T> extends ReadConfigValueGeneralOptions {
  defaultValue?: T;
  required?: boolean; // if true, throw on error if the value is not found
}

type ReadConfigValueFn = <T>(objectPath: string, options?: ReadConfigValueOptions<T>) => MaybeUndefined<T>;

export function readConfigValue<T>(
  fileLocationsMap: FileLocationsMap,
  objectPath: string,
  options: ReadConfigValueOptions<T> & { required: true }
): T | never
export function readConfigValue<T>(
  fileLocationsMap: FileLocationsMap,
  objectPath: string,
  options?: ReadConfigValueOptions<T>
): MaybeUndefined<T>

/* Given an object defining file locations and an object path, return the value found at that
   first matching object path in those files; if `defaultValue` is specified in the options and
   the object path isn't found, return `defaultValue`; if the `required` option is `true`,
   throw an error if the object path isn't found */
export function readConfigValue<T>(
  fileLocationsMap: FileLocationsMap,
  objectPath: string,
  options: ReadConfigValueOptions<T> = {}
): MaybeUndefined<T> {
  const { defaultValue, exitOnError, ignoreEmpty, quiet, required } = options;

  const filepaths = parseFilepaths(fileLocationsMap);
  const configs = filepaths.map(pathToFile => readConfigFile({ pathToFile }));

  let emptyValueFound = false;

  /* Check each file in succession; as soon as a match is found, return it. */
  for (let i = 0; i < configs.length; i += 1) {
    const config = configs[i];
    const value = getOrDefault(config, objectPath);
    if (value !== undefined) {
      if (value !== '') {
        return value
      }
      if (!ignoreEmpty) {
        return value;
      }
      emptyValueFound = true; // indicates that the object path has an empty string value in at least one config file
    }
  }

  if (required && defaultValue === undefined) {
    const relativeFilepaths = filepaths.map(filepath => path.relative(path.resolve(), filepath)).join(', ');
    const unit = inflectByNumber(filepaths.length, 'config');
    const errorMsgPrefix = emptyValueFound ? 'A non-empty value for the' : 'The';
    const errorMsg = [
      errorMsgPrefix,
      `key '${objectPath}' was not found in the ${unit}: ${relativeFilepaths}`,
    ].join(' ');
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
  generalOptions: FileLocationsMap & ReadConfigValueGeneralOptions
): ReadConfigValueFn {
  const { exitOnError, ignoreEmpty, quiet, ...locationsMap } = generalOptions;
  const defaultOptions = { exitOnError, ignoreEmpty, quiet };
  return <T>(
    objectPath: string, valueOptions: ReadConfigValueOptions<T> = {}
  ): typeof valueOptions extends { required: true } ? T : MaybeUndefined<T> => {
    const mergedOptions = {
      ...defaultOptions,
      ...valueOptions,
    }
    return readConfigValue<T>(locationsMap, objectPath, mergedOptions);
  }
}
