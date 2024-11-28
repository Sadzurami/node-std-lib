import fs from 'fs-extra';
import path from 'path';

import { ReadConfigOptions } from './types/read.config.options.type';
import { ReadProxiesOptions } from './types/read.proxies.options.type';

export async function readProxies(file: string, options?: ReadProxiesOptions): Promise<string[]> {
  options = { ensure: true, ...options };

  let content: string = '';
  try {
    if (options.ensure) await fs.ensureFile(file);
    content = await fs.readFile(file, 'utf-8');
  } catch (error) {}

  const proxies: Set<string> = new Set();

  for (const line of content.split(/\r?\n/)) {
    try {
      const proxy = new URL(line.trim()).toString().slice(0, -1);

      proxies.add(proxy);
    } catch (error) {}
  }

  return [...proxies.values()];
}

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
