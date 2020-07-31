/* eslint-disable @typescript-eslint/ban-types */

import { MaybeUndefined } from '@skypilot/common-types';
import lodashGet from 'lodash.get';

export type GetOrDefaultFunction<T> = (objectPath: string, defaultValue?: T) => MaybeUndefined<T>;

/* -- Signatures -- */
export function getOrDefault<T>(obj: object, objectPath: string, defaultValue?: T): T | undefined;
export function getOrDefault<T>(objectPath: string, defaultValue?: T): T | undefined;
export function getOrDefault<T>(obj: object): GetOrDefaultFunction<T>;

/* -- Implementation -- */
/* Given an object, a path, and (optionally) a default value, return the value mapped to the path
 * or, if the path is unmapped, then the default value or `undefined`.
 * Given an object, apply the object to the function and return a function that accepts the
 * remaining two parameters. */
export function getOrDefault<T>(
  arg1: object | string, arg2?: string | T, arg3?: T
): T | undefined | GetOrDefaultFunction<T> {
  if (typeof arg1 === 'object') {
    if (typeof arg2 === 'string') {
      return lodashGet(arg1, arg2, arg3);
    }
    return (objectPath: string, defaultValue?: T) => getOrDefault<T>(arg1, objectPath, defaultValue);
  }
  throw new Error('getOrDefault requires an object');
}
