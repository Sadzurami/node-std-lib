import readPkgUp from 'read-pkg-up';

import { ReadPackageJsonOptions, ReadPackageJsonResult } from './types/package-json.types';

export async function readPackageJson(options?: ReadPackageJsonOptions): Promise<ReadPackageJsonResult> {
  options = { cwd: process.cwd(), normalize: true, ...options };

  try {
    return (await readPkgUp(options)).packageJson;
  } catch (error) {
    throw new Error('Failed to read package.json', { cause: error });
  }
}
