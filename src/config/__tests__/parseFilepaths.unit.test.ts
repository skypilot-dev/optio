import { parseFilepaths } from '../parseFilepaths';

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
