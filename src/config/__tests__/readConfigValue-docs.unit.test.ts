import path from 'path';
import { readConfigValue } from '../readConfigValue';

const filepaths = [
  path.join(__dirname, 'docs', 'config.yaml'),
  path.join(__dirname, 'docs', 'config-defaults.yaml'),
];

describe('readConfigValue(', () => {
  it('can read a setting from a YAML file', () => {
    const value = readConfigValue<string>(
      { filepaths },
      'user.username'
    );
    expect(value).toBe('jdoe');
  });

  it("if the path isn't found in the 1st config, should use the 2nd config", () => {
    const value = readConfigValue<number>({ filepaths }, 'service.port');
    expect(value).toBe(3000);
  });

  it("if the setting doesn't exist and a default value is set, should return that value", () => {
    const defaultValue = 'Unknown';
    const value: string = readConfigValue(
      { filepaths },
      'user.name',
      { defaultValue: 'Unknown' }
    );

    expect(value).toBe(defaultValue);
  });

  it("if the setting doesn't exist and is required, should throw an error", () => {
    expect(() => {
      readConfigValue(
        { filepaths },
        'badKey',
        { required: true }
      );
    }).toThrow("The key 'badKey' was not found in the configs");
  });

  it('if `ignoreEmpty: true`, an empty string should be treated as undefined', () => {
    const value = readConfigValue<string>(
      { filepaths },
      'service.apiToken', // object path
      { ignoreEmpty: true },
    );
    expect(value).toBe(undefined);
  });

  it('if `ignoreEmpty: true`, `required: true`, and no non-empty value is found, should throw an error', () => {
    expect(() => {
      readConfigValue<string>(
        { filepaths },
        'service.apiToken', // object path
        { ignoreEmpty: true, required: true },
      );
    }).toThrowError("A non-empty value for the key 'service.apiToken' was not found in the configs");
  });
});
