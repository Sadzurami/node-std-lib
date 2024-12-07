import readPkgUp from 'read-pkg-up';

import { ReadPackageJsonOptions } from './types/read.package.json.options.type';

export async function readPackageJson(options?: ReadPackageJsonOptions) {
  options = { cwd: process.cwd(), normalize: true, ...options };

  try {
    return (await readPkgUp(options)).packageJson;
  } catch (error) {
    throw new Error('Failed to read package.json', { cause: error });
  }
}
