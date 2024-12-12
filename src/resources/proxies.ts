import fs from 'fs-extra';

import { ReadProxiesOptions } from './types/proxies.types';

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
