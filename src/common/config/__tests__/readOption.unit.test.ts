import path from 'path';
import { readOption, readOptionFn, parseFilepaths } from '../readOption';

const tmpDirs = ['main', 'overrides'].map(dir => path.join(__dirname, dir));
const filename = 'options.test.yml';
const tmpFilepaths = tmpDirs.map(dir => path.join(dir, filename));

describe('parseFilepaths(:(ReadConfigDirOptions | ReadConfigFilepathOptions))', () => {
  it('given a filename and directories, should create filepaths from them', () => {
    const options = {
      configDir: '.skypilot',
      overridesDir: 'local',
      filename: 'optio.yaml',
    };
    const parsedFilepaths = parseFilepaths(options);

    const expectedFilepaths = [
      '.skypilot/optio.yaml',
      'local/optio.yaml',
    ];
    expect(parsedFilepaths).toEqual(expectedFilepaths);
  });

  it('given filepaths, should filter out the undefined ones', () => {
    const options = {
      configFilepath: '.skypilot/optio.yaml',
      defaultsFilepath: undefined,
      overridesFilepath: 'local/optio.yaml',
    };

    const parsedFilepaths = parseFilepaths(options);

    const expectedFilepaths = [
      '.skypilot/optio.yaml',
      'local/optio.yaml',
    ];
    expect(parsedFilepaths).toEqual(expectedFilepaths);
  });
});

describe('readOption(', () => {
  const [configFilepath, overridesFilepath] = tmpFilepaths;
  it('can read a setting from a YAML file', () => {
    const options = { configFilepath };
    const value = readOption(options, 'version');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it('if no override exists, should return the main value', () => {
    const options = { configFilepath };
    const readConfigOption = readOptionFn(options);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const value = readConfigOption('version');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it('if an override exists, should return the override', () => {
    const options = { configFilepath, overridesFilepath };
    const value = readOption(options, 'version');

    const expectedValue = 2;
    expect(value).toBe(expectedValue);
  });

  it("if the setting doesn't exist, should return the default", () => {
    const defaultValue = 0;
    const options = { configFilepath, overridesFilepath };
    const value = readOption(options, 'nonexistent-objectPath', defaultValue);

    expect(value).toBe(defaultValue);
  });

  it("if a config file isn't found, should skip it", () => {
    const defaultValue = 0;
    const options = {
      configFilepath: 'nonexistent-file',
      overridesFilepath: 'nonexistent-file',
    };
    const readConfigOption = readOptionFn(options);
    const value = readConfigOption('nonexistent-objectPath', defaultValue);

    expect(value).toBe(defaultValue);
  });
});
