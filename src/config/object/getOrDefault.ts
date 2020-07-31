/* eslint-disable @typescript-eslint/ban-types */

import lodashGet from 'lodash.get';

export function getOrDefault<O extends object, K>(
  obj: O, path: K extends keyof O ? K : string
): K extends keyof O ? O[K] : undefined;

export function getOrDefault<O extends object, K, V>(
  obj: O, path: K extends keyof O ? K : string, defaultValue: K extends keyof O ? O[K] | V : V
): typeof defaultValue;

/* -- Implementation -- */
/* Given an object, a path, and (optionally) a default value, return the value mapped to the path
   or, if the path is unmapped, then the default value or `undefined`. */

export function getOrDefault<O extends object, K, T>(
  obj: O, path: K extends keyof O ? K : string, defaultValue?: K extends keyof O ? O[K] : T
): K extends keyof O ? O[K] : T | undefined {
  if (typeof obj !== 'object') {
    throw new Error('getOrDefault requires an object');
  }
  return lodashGet(obj, path, defaultValue);
}
