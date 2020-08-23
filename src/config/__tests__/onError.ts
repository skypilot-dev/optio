import path from 'path';
import { inflectByNumber } from '@skypilot/sugarbowl';

function debugLine(): string {
  const e = new Error();
  const frame = e.stack?.split('\n')[4] || '';
  const lineNumber = frame.split(':')[1];
  const pathToFile = frame
    .split('(')[1]
    .split(')')[0]
    .split(':')[0];
  const relativePathToFile = path.relative(path.resolve(), pathToFile);
  return `Error at ${relativePathToFile}:${lineNumber}`;
}

interface OnErrorInput {
  filepaths: string[];
  objectPath: string;
  /* Optional */
  emptyValueFound?: boolean;
  exitOnError?: boolean;
  quiet?: boolean;
}

export function onError(options: OnErrorInput): string {
  const { emptyValueFound, exitOnError, filepaths, objectPath, quiet } = options;

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
      console.error(`${debugLine()}\n  ${errorMsg}`);
    }
    process.exit(1);
  }
  throw new Error(errorMsg);
}
