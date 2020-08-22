import { readPackageFile } from '@skypilot/sugarbowl';
import { parsePackageName } from 'src/common/string/parsePackageName';

interface FilenameMap {
  directories: string[];
  filename: string;
}

interface FilepathsMap {
  filepaths: string[];
}

/* The options object can be
   - an array of directories and a single filename or
   - an array of file paths
 */
export type FileLocationsMap =  FilenameMap | FilepathsMap;

/* Given an object with values for 1) directories and a filename or 2) an array of filepaths,
   return an array of filepaths. */
function generateFilepaths(options: FileLocationsMap): string[] {
  const packageName = readPackageFile().name as string;
  const { directory: defaultDirectory, filename: defaultFilename } = parsePackageName(packageName);
  const {
    directories = [defaultDirectory, 'local'],
    filename = defaultFilename,
  } = options as FilenameMap;
  return directories.map(dir => `${dir}/${filename}`);
}

export function parseFilepaths(options: FileLocationsMap): string[] {
  return Object.prototype.hasOwnProperty.call(options, 'filename')
    ? generateFilepaths(options as FilenameMap)
    : (options as FilepathsMap).filepaths;
}
