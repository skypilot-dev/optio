# @skypilot/optio

[![npm stable](https://img.shields.io/npm/v/@skypilot/optio?label=stable)](https://www.npmjs.com/package/@skypilot/optio)
![stable build](https://img.shields.io/github/workflow/status/skypilot-dev/optio/Stable%20release?label=stable%20build)
[![npm next](https://img.shields.io/npm/v/@skypilot/optio/next?label=next)](https://www.npmjs.com/package/@skypilot/optio)
![next build](https://img.shields.io/github/workflow/status/skypilot-dev/optio/Prerelease?branch=next&label=next%20build)
![Codacy grade](https://img.shields.io/codacy/grade/e5a0096791cd4e5fa0d911d3cc00c654)
![downloads](https://img.shields.io/npm/dm/@skypilot/optio)
[![license: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A tool for managing package options

## Functionality

- `configureReadConfigValue`: Return a function that calls `readConfigValue` with preset options
- `readConfigFile`: Read and deserialize a config file 
- `readConfigValue`: Read a value from one or more serialized config files

- `readConfig`: Deprecated; use `readConfigValue` instead
