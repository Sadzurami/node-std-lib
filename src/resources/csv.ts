import fs from 'fs-extra';
import path from 'path';

import { ReadCsvOptions, SaveCsvOptions } from './types/csv.types';

export async function readCsv<T>(file: string, options?: ReadCsvOptions): Promise<T[]> {
  options = { ensure: true, convert: true, ...options };

  let content: string = '';
  try {
    if (options.ensure) await fs.ensureFile(file);
    content = await fs.readFile(file, 'utf-8');
  } catch (error) {}

  const [header, ...entries] = content.split(/\r?\n/);
  if (!header?.length || !entries.length) return [];

  const keys: string[] = header.split(';').map((key) => key.trim());
  const data: T[] = [];

  for (const entry of entries) {
    const values: string[] = entry.split(';').map((value) => value.trim());
    const object: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
      object[keys[i]] = options.convert ? convertValue(values[i]) : values[i];
    }

    data.push(object as T);
  }

  return data;
}

export async function saveCsv<T>(file: string, data: T[], options?: SaveCsvOptions) {
  options = { ensure: true, ...options };

  try {
    const keys: string[] = Object.keys(data[0]);

    const header: string = keys.join(';');
    const entries: string[] = data.map((object) =>
      keys
        .map((key) => {
          const value = object[key];
          return typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
        })
        .join(';'),
    );

    if (options.ensure) await fs.ensureDir(path.dirname(file));

    await fs.writeFile(file, [header, ...entries].join('\n'));
  } catch (error) {
    throw new Error('Failed to save csv', { cause: error });
  }
}

function convertValue(value: string): any {
  if (value === 'true') return true;
  if (value === 'false') return false;

  if (value === 'null') return null;
  if (value === 'undefined') return undefined;

  const date = new Date(value);
  if (!isNaN(date.getTime())) return date;

  if (value.includes(',')) return value.split(',').map(convertValue);
  if (!isNaN(Number(value))) return Number(value);

  return value;
}