import type { MaybeUndefined } from '@skypilot/common-types';
import { getOrDefault } from './object/getOrDefault';
import { parseFilepaths } from './parseFilepaths';
import type { FileLocationsMap } from './parseFilepaths';
import { readConfigFile } from './readConfigFile';

export type ReadConfigFileOptions = FileLocationsMap;

interface ReadConfigValueOptions<T> {
  defaultValue?: T;
  required?: boolean;
}

type ReadConfigValueFn = <T>(objectPath: string, options?: ReadConfigValueOptions<T>) => MaybeUndefined<T>;

export function readConfigValue<T>(
  configFileOptions: ReadConfigFileOptions,
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

  const { defaultValue, required = false } = options;
  if (required) {
    throw new Error('')
  }
  return defaultValue;
}

/* Given `configFileOptions`, apply them to `readConfigValue` & return a function accepting the remaining args */
export function applyToReadConfigValue(
  configFileOptions: ReadConfigFileOptions
): ReadConfigValueFn {
  return <T>(
    objectPath: string, options: ReadConfigValueOptions<T> = {}
  ): MaybeUndefined<T> => {
    const { defaultValue, required } = { defaultValue: undefined, required: false, ...options };
    if (required) {
      return readConfigValue<T>(configFileOptions, objectPath, { required });
    }
    return readConfigValue<T>(configFileOptions, objectPath, { defaultValue });
  }
}
