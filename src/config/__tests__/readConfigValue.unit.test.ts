import path from 'path';
import { readConfigValue, applyToReadConfigValue } from '../readConfigValue';

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
    const readConfigs = applyToReadConfigValue(options); // demonstrate that partial application works
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

  it("if a config file isn't found, should skip it", () => {
    const defaultValue = 0;
    const options = {
      filepaths: ['nonexistent-file', 'nonexistent-file'],
    };
    const readConfigs = applyToReadConfigValue(options);
    const value = readConfigs('nonexistent-objectPath', { defaultValue });

    expect(value).toBe(defaultValue);
  });
});
