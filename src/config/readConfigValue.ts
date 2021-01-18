import type { Integer, MaybeUndefined } from '@skypilot/common-types';
import { onError } from './onError';
import { getOrDefault } from './object/getOrDefault';
import { parseFilepaths } from './parseFilepaths';
import type { FileLocationsMap } from './parseFilepaths';
import { readConfigFile } from './readConfigFile';

export interface ReadConfigValueGeneralOptions {
  addedCallDepth?: Integer; // how many additional levels to go down the call stack to identify the caller in errors
  ignoreEmpty?: boolean; // if true, empty string values are considered missing (undefined) even if the key is found
  exitOnError?: boolean; // if true, `process.exit(1)` on error
  quiet?: boolean; // if true, send no output to the console on `process.exit(1)`
}

export interface ReadConfigValueOptions<T> extends ReadConfigValueGeneralOptions {
  defaultValue?: T;
  required?: boolean; // if true, throw on error if the value is not found
}

// type ReadConfigValueFn = <T>(objectPath: string, options?: ReadConfigValueOptions<T>) => MaybeUndefined<T>;

export function readConfigValue<T>(
  fileLocationsMap: FileLocationsMap,
  objectPath: string,
  options: ReadConfigValueOptions<T> & { defaultValue: T }
): T
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
): MaybeUndefined<T> | never {
  const { addedCallDepth, defaultValue, exitOnError, ignoreEmpty, quiet, required } = options;

  const filepaths = parseFilepaths(fileLocationsMap);
  const configs = filepaths.map(pathToFile => readConfigFile({ pathToFile }));

  let emptyValueFound = false;

  /* Check each file in succession; as soon as a match is found, return it. */
  for (let i = 0; i < configs.length; i += 1) {
    const config = configs[i];
    const value = getOrDefault(config, objectPath);
    if (value !== undefined) {
      if (value !== '') {
        return value;
      }
      if (!ignoreEmpty) {
        return value;
      }
      emptyValueFound = true; // indicates that the object path has an empty string value in at least one config file
    }
  }

  if (required && defaultValue === undefined) {
    onError({ addedCallDepth, emptyValueFound, exitOnError, filepaths, objectPath, quiet });
  }
  return defaultValue;
}

/* Given a set of options, apply them to `readConfigValue` & return a function accepting the remaining args */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export function configureReadConfigValue(
  generalOptions: FileLocationsMap & ReadConfigValueGeneralOptions
) {
  const { addedCallDepth = 1, exitOnError, ignoreEmpty, quiet, ...locationsMap } = generalOptions;
  const defaultOptions = { addedCallDepth, exitOnError, ignoreEmpty, quiet };

  function readConfig<T>(objectPath: string, options: ReadConfigValueOptions<T> & { defaultValue: T }): T
  function readConfig<T>(objectPath: string, options: ReadConfigValueOptions<T> & { required: true }): T | never
  function readConfig<T>(objectPath: string, options?: ReadConfigValueOptions<T>): MaybeUndefined<T>

  function readConfig<T>(objectPath: string, valueOptions: ReadConfigValueOptions<T> = {}) {
    const mergedOptions = {
      ...defaultOptions,
      ...valueOptions,
    };
    return readConfigValue<T>(locationsMap, objectPath, mergedOptions);
  }

  return readConfig;
}
