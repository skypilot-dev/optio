export function parsePackageName(packageName: string): { directory?: string; filename: string } {
  if (!packageName.includes('/')) {
    return { filename: packageName };
  }
  const matches = packageName.match(/^(?:@)?([A-Za-z0-9.-]+)(?:\/)?([A-Za-z0-9-.]+)/);
  if (!matches || matches.length < 3) {
    return { directory: '', filename: '' };
  }
  const owner = matches[1];
  const repo = matches[2];
  return {
    directory: `.${owner}`,
    filename: `${repo}.yaml`,
  }
}

