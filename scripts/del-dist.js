/* eslint-disable */

const fs = require('fs-extra');
const path = require('path');

const distDirectory = path.join(__dirname, '..');
const ignoreEntries = ['src', 'scripts', 'node_modules'];

main();
async function main() {
  await fs.rm(path.join(distDirectory, 'core'), { recursive: true, force: true });

  for (const entry of await readDirectory(distDirectory, false)) {
    if (path.basename(entry).startsWith('.')) continue;

    if (ignoreEntries.some((el) => entry.includes(el))) continue;

    if (['.js', '.d.ts', '.map'].some((ext) => entry.endsWith(ext))) await fs.rm(entry, { force: true });
  }
}

async function readDirectory(entry, recursive = true) {
  try {
    const files = await fs.readdir(entry, { withFileTypes: true });
    const results = [];

    for (const file of files) {
      if (file.isDirectory() && recursive) {
        const entries = await readDirectory(path.join(entry, file.name));

        results.push(...entries);
      }

      if (file.isFile()) results.push(path.join(entry, file.name));
    }

    return results;
  } catch (error) {
    return [];
  }
}
