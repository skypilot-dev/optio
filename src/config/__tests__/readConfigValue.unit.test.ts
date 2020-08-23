import path from 'path';
import { readConfigValue, configureReadConfigValue } from '../readConfigValue';

const tmpDirs = ['overrides', 'primary'].map(dir => path.join(__dirname, dir));
const filename = 'config.test.yaml';
const tmpFilepaths = tmpDirs.map(dir => path.join(dir, filename));

describe('readConfigValue(', () => {
  it('can read a setting from a YAML file', () => {
    const primaryFilepath = tmpFilepaths[1];
    const options = { filepaths: [primaryFilepath] };
    const value = readConfigValue<number>(options, 'version');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it('if no override exists, should return the primary value', () => {
    const primaryFilepath = tmpFilepaths[1];
    const options = { filepaths: [primaryFilepath] };
    const readConfigs = configureReadConfigValue(options); // demonstrate that partial application works
    const value = readConfigs('version');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it('if an override exists, should return the override', () => {
    const options = { filepaths: tmpFilepaths };
    const value = readConfigValue(options, 'version');

    const expectedValue = 2;
    expect(value).toBe(expectedValue);
  });

  it("if the setting doesn't exist, should return undefined", () => {
    const options = { filepaths: tmpFilepaths };
    const value = readConfigValue(options, 'nonexistent-objectPath' );

    expect(value).toBe(undefined);
  });

  it("if the setting doesn't exist and a default value is set, should return that value", () => {
    const defaultValue = 0;
    const options = { filepaths: tmpFilepaths };
    const value = readConfigValue(options, 'nonexistent-objectPath', { defaultValue });

    expect(value).toBe(defaultValue);
  });

  it("if the setting doesn't exist and a default value is set, should return that value", () => {
    const defaultValue = 0;
    const options = { filepaths: tmpFilepaths };
    const value = readConfigValue(options, 'nonexistent-objectPath', { defaultValue });

    expect(value).toBe(defaultValue);
  });

  it("if the setting doesn't exist and is required, should throw an error", () => {
    const options = { filepaths: tmpFilepaths };

    expect(() => {
      readConfigValue(options, 'nonexistent-objectPath', { required: true });
    }).toThrow();
  });

  it('if a default value is provided, the `required` option should be ignored', () => {
    expect.assertions(2);
    const options = { filepaths: tmpFilepaths };

    expect(() => {
      const valueOptions = { defaultValue: 0, required: true };

      const value = readConfigValue(options, 'nonexistent-objectPath', valueOptions);

      expect(value).toBe(0);
    }).not.toThrow();
  });

  it("if a config file isn't found, should skip it", () => {
    const defaultValue = 0;
    const options = {
      filepaths: ['nonexistent-file', 'nonexistent-file'],
    };
    const readConfigs = configureReadConfigValue(options);
    const value = readConfigs('nonexistent-objectPath', { defaultValue });

    expect(value).toBe(defaultValue);
  });
});

describe('configureReadConfigValue()', () => {
  it('should set the defaults for calls to the returned function', () => {
    /* Set `required: true` on all calls to `readValue` */
    const readValue = configureReadConfigValue({ filepaths: tmpDirs, required: true });

    expect(() => {
      readValue('nonexistent-objectPath');
    }).toThrow();
  });

  it('options passed to the returned function should override the defaults', () => {
    /* Set `required: true` on all calls to `readValue` */
    const readValue = configureReadConfigValue({ filepaths: tmpFilepaths, required: true });

    const value = readValue('nonexistent-objectPath', { required: false });

    expect(value).toBe(undefined);
  });
});
