import fs from 'fs-extra';
import path from 'path';

import { ReadConfigOptions } from './types/config.types';

export async function readConfig<T>(file: string, _default: T, options?: ReadConfigOptions) {
  options = { ensure: true, ...options };

  const config: T & { origin?: string } = _default as T & { origin?: string };

  try {
    if (options.ensure) {
      await fs.ensureDir(path.dirname(file));
      if (!(await fs.exists(file))) await fs.writeFile(file, JSON.stringify(config, null, 2));
    }

    const content = await fs.readFile(file, 'utf-8').then((content) => content.trim());
    config.origin = content === JSON.stringify(config, null, 2) ? 'default' : 'custom';

    const candidate = JSON.parse(content) as Record<string, any>;
    for (const key of Object.keys(config)) {
      if (!Object.hasOwn(candidate, key)) continue;
      if (config[key] === candidate[key]) continue;

      config[key] = candidate[key];
    }
  } catch (error) {}

  return { ...config, origin: config.origin || 'default' };
}
