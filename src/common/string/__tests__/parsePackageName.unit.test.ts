import { parsePackageName } from '../parsePackageName';

describe('parseRepoName()', () => {
  it('should ', () => {
    const packageName = '@skypilot/optio-tools';
    const { directory, filename } = parsePackageName(packageName);
    const expectedNames = {
      directory: '.skypilot',
      filename: 'optio-tools.yaml',
    };
    expect({ directory, filename }).toEqual(expectedNames);
  });
});
