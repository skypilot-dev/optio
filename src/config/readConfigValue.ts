import path from 'path';
import type { MaybeUndefined } from '@skypilot/common-types';
import { inflectByNumber } from '@skypilot/sugarbowl';
import { getOrDefault } from './object/getOrDefault';
import { parseFilepaths } from './parseFilepaths';
import type { FileLocationsMap } from './parseFilepaths';
import { readConfigFile } from './readConfigFile';

interface ReadConfigValueGeneralOptions {
  allowEmpty?: boolean; // unless true, empty values are considered missing even if the key is found
  exitOnError?: boolean; // if true, `process.exit(1)` on error
  quiet?: boolean; // if true, send no output to the console on `process.exit(1)`
  required?: boolean; // if true, throw on error if the value is not found
}

interface ReadConfigValueOptions<T> extends ReadConfigValueGeneralOptions {
  defaultValue?: T;
}

type ReadConfigValueFn = <T>(objectPath: string, options?: ReadConfigValueOptions<T>) => MaybeUndefined<T>;

/* Given an object defining file locations and an object path, return the value found at that
   first matching object path in those files; if `defaultValue` is specified in the options and
   the object path isn't found, return `defaultValue`; if the `required` option is `true`,
   throw an error if the object path isn't found */
export function readConfigValue<T>(
  fileLocationsMap: FileLocationsMap,
  objectPath: string,
  options: ReadConfigValueOptions<T> = {}
): MaybeUndefined<T> {
  const { allowEmpty, defaultValue, exitOnError, quiet, required } = options;

  const filepaths = parseFilepaths(fileLocationsMap);
  const configs = filepaths.map(pathToFile => readConfigFile({ pathToFile }));

  /* Check each file in succession; as soon as a match is found, return it. */
  for (let i = 0; i < configs.length; i += 1) {
    const config = configs[i];
    const value = getOrDefault(config, objectPath);
    if (value !== undefined && (value !== '' || allowEmpty)) {
      return value;
    }
  }

  if (required && defaultValue === undefined) {
    const relativeFilepaths = filepaths.map(filepath => path.relative(path.resolve(), filepath)).join(', ');
    const unit = inflectByNumber(filepaths.length, 'config');
    const errorMsg = `The key '${objectPath}' was not found in the ${unit}: ${relativeFilepaths}`;
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
  const { allowEmpty, exitOnError, quiet, required, ...locationsMap } = generalOptions;
  const defaultOptions = { allowEmpty, exitOnError, quiet, required };
  return <T>(
    objectPath: string, valueOptions: ReadConfigValueOptions<T> = {}
  ): MaybeUndefined<T> => {
    const mergedOptions = {
      ...defaultOptions,
      ...valueOptions,
    }
    return readConfigValue<T>(locationsMap, objectPath, mergedOptions);
  }
}
