import { readConfigValue } from '../config';

const filepaths = [
  'src/config/__tests__/docs/config.yaml',
  'src/config/__tests__/docs/config-defaults.yaml',
];

const username: string | undefined = readConfigValue<string>(
  { filepaths },
  'user.username'
);
console.log('username:', username);

let apiToken: string = readConfigValue<string>(
  { filepaths },
  'service.apiToken',
  { required: true }
)
console.log('apiToken:', apiToken);

apiToken = readConfigValue<string>(
  { filepaths },
  'service.apiToken',
  { exitOnError: true, ignoreEmpty: true, required: true }
)
console.log('apiToken:', apiToken);
