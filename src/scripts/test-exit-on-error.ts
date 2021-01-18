import { configureReadConfigValue, readConfigValue } from '../config';

const filepaths = [
  'src/config/__tests__/docs/config.yaml',
  'src/config/__tests__/docs/config-defaults.yaml',
];

const username: string | undefined = readConfigValue<string>(
  { filepaths },
  'user.username'
);
console.log('username:', username);

const apiToken: string = readConfigValue<string>(
  { filepaths },
  'service.apiToken',
  { required: true }
);
console.log('apiToken:', apiToken);

/* This call deliberately throws an error */
const readConfig = configureReadConfigValue({ filepaths });
readConfig<string>(
  'service.apiToken',
  { exitOnError: true, ignoreEmpty: true, required: true }
);

/* This call deliberately throws an error */
readConfigValue<string>(
  { filepaths },
  'service.apiToken',
  { exitOnError: true, ignoreEmpty: true, required: true }
);
