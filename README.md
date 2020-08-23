# @skypilot/optio

[![npm stable](https://img.shields.io/npm/v/@skypilot/optio?label=stable)](https://www.npmjs.com/package/@skypilot/optio)
![stable build](https://img.shields.io/github/workflow/status/skypilot-dev/optio/Stable%20release?label=stable%20build)
[![npm next](https://img.shields.io/npm/v/@skypilot/optio/next?label=next)](https://www.npmjs.com/package/@skypilot/optio)
![next build](https://img.shields.io/github/workflow/status/skypilot-dev/optio/Prerelease?branch=next&label=next%20build)
![Codacy grade](https://img.shields.io/codacy/grade/e5a0096791cd4e5fa0d911d3cc00c654)
![downloads](https://img.shields.io/npm/dm/@skypilot/optio)
[![license: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A tool for managing package options

## How to install

```console
# Yarn
yarn add @skypilot/optio

# NPM
npm install @skypilot/optio
```

## How it works

Optio looks up values in one or more YAML files by object path, successively searching through
the files until it finds the object path. As soon as the path is found, the corresponding value
is returned.

This approach allows for a flexible set of configuration files that contain primary, fallback, and
override values.

## How to use

The examples below use these config files:

```yaml
# defaults/config.yaml
service:
  # Set the API token in your local config file; do not commit to the repo
  apiToken: '' 
  endpoint: 'https://skypilot.dev'
  port: 3000
```

```yaml
# config.yaml
service:
  apiToken: ''
user:
  email: 'jdoe@example.com'
  mode: 'admin'
  username: 'jdoe'
```

### Examples

In these examples, type parameters (e.g., `<string>`) are optional, although recommended, for
TypeScript users. The type parameters must be omitted in plain JavaScript.

In each case, import the function from the library:

```typescript
import { readConfigValue } from '@skypilot/optio'
```

#### Simple lookup

```typescript
import { readConfigValue } from '@skypilot/optio'

const value = readConfigValue<string>(
  // The config files to use; paths are resolved relative to the project root
  { filepaths: ['config.yaml', 'config-defaults.yaml'] },
  'service.username' // object path
)
// typeof value: string | undefined
// value = 'jdoe'
```

Optio searches through the first file, `config.yaml`, for the object path
`service.username`. Because the path exists in that file, Optio returns the
corresponding value, `'jdoe'`.

The return value's type is that of the type parameter, `string`, or `undefined` if the
object path isn't found.


---

#### Simple lookup falling back to second config

```typescript
const value = readConfigValue<number>(
  { filepaths: ['config.yaml', 'config-defaults.yaml'] },
  'service.port' // objectPath
)
// typeof value: number | undefined
// value = 3000
```

Optio searches through `config.yaml` for the object path `service.port`.
Because the path isn't found in that file, Optio searches the second file,
`config-defaults.yaml`. The path exists in that file, so Optio returns
the corresponding value, `3000`.

The return value's type is that of the type parameter, `number`, or `undefined` if the
object path isn't found.

---

#### Simple lookup with default value

```typescript
const value = readConfigValue(
  { filepaths: ['config.yaml', 'config-defaults.yaml'] },
  'user.name', // object path
  { defaultValue: 'Unknown' }, // default value
)
// typeof value: string
// value = 'Unknown'
```

Optio finds `user.name` in neither of the config files, so it returns the default value,
`'Unknown'`. The return value's type is inferred to be that of the default value, `string`.

### Advanced examples

#### Required value

If the `required` option is set to `true`, Optio will throw an error if the object path isn't found.

```typescript
const value = readConfigValue<string>(
  { filepaths: ['config.yaml', 'config-defaults.yaml'] },
  'badKey',
)
/*
  Error: The key 'badKey' was not found in the configs: config.yaml,
  config-defaults.yaml
 */
// 
```

#### Ignoring empty values

If the `ignoreEmpty` option is set to `true`, Optio will treat empty strings in the config files
as nonexistent values.

```typescript
const value = readConfigValue<string>(
  { filepaths: ['config.yaml', 'config-defaults.yaml'] },
  'service.apiToken',
  { ignoreEmpty: true },
)
// typeof value: string | undefined
// value = undefined
```

Optio finds `service.apiToken` in both of the configs, but in each case ignores the entry
because the value is an empty string, and therefore returns `undefined`.

The `ignoreEmpty` and `required` options can be combined to verify that placeholders are not left
empty, as in this slightly modified version of the previous example:

```typescript
const value = readConfigValue<string>(
  { filepaths: ['config.yaml', 'config-defaults.yaml'] },
  'service.apiToken',
  { ignoreEmpty: true, required: true },
)
// typeof value: string
/*
  Error: A non-empty value for the key 'service.apiToken' was not found in the
   configs: config.yaml, config-defaults.yaml
 */
```

### Partial application

**To do:** Add examples showing how to use `configureReadConfigValue`.

## List of exported functions

- `configureReadConfigValue`: Return a function that calls `readConfigValue` with preset options
- `readConfigFile`: Read and deserialize a config file 
- `readConfigValue`: Read a value from one or more serialized config files

- `readConfig`: Deprecated; use `readConfigValue` instead

## How to remove

```console
# Yarn
yarn remove @skypilot/optio

# NPM
npm uninstall @skypilot/optio
```
