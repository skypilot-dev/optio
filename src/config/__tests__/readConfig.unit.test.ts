import path from 'path';
import { readConfig, readConfigFn, parseFilepaths } from '../readConfig';

const tmpDirs = ['overrides', 'primary'].map(dir => path.join(__dirname, dir));
const filename = 'config.test.yaml';
const tmpFilepaths = tmpDirs.map(dir => path.join(dir, filename));

describe('parseFilepaths(:(ReadConfigDirOptions | ReadConfigFilepathOptions))', () => {
  it('given a filename and directories, should create filepaths from them', () => {
    const options = {
      directories: ['.skypilot', 'local'],
      filename: 'optio.yaml',
    };
    const parsedFilepaths = parseFilepaths(options);

    const expectedFilepaths = [
      '.skypilot/optio.yaml',
      'local/optio.yaml',
    ];
    expect(parsedFilepaths).toEqual(expectedFilepaths);
  });

  it('given filepaths, should return the filepaths', () => {
    const options = {
      filepaths: [
        '.skypilot/optio.yaml',
        'local/optio.yaml',
      ],
    };

    const parsedFilepaths = parseFilepaths(options);

    const expectedFilepaths = [
      '.skypilot/optio.yaml',
      'local/optio.yaml',
    ];
    expect(parsedFilepaths).toEqual(expectedFilepaths);
  });
});

describe('readConfig(', () => {
  it('can read a setting from a YAML file', () => {
    const primaryFilepath = tmpFilepaths[1];
    const options = { filepaths: [primaryFilepath] };
    const value = readConfig(options, 'version');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it('if no override exists, should return the primary value', () => {
    const primaryFilepath = tmpFilepaths[1];
    const options = { filepaths: [primaryFilepath] };
    const readConfigs = readConfigFn(options);
    const value = readConfigs('version');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it('if an override exists, should return the override', () => {
    const options = { filepaths: tmpFilepaths };
    const value = readConfig(options, 'version');

    const expectedValue = 2;
    expect(value).toBe(expectedValue);
  });

  it("if the setting doesn't exist, should return the default", () => {
    const defaultValue = 0;
    const options = { filepaths: tmpFilepaths };
    const value = readConfig(options, 'nonexistent-objectPath', defaultValue);

    expect(value).toBe(defaultValue);
  });

  it("if a config file isn't found, should skip it", () => {
    const defaultValue = 0;
    const options = {
      filepaths: ['nonexistent-file', 'nonexistent-file'],
    };
    const readConfigs = readConfigFn(options);
    const value = readConfigs('nonexistent-objectPath', defaultValue);

    expect(value).toBe(defaultValue);
  });
});
