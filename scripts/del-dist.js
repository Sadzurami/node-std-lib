/* eslint-disable */

const fs = require('fs-extra');
const path = require('path');

const distDirectory = process.cwd();
const ignoreEntries = ['node_modules', '.eslintrc.js'];

main();
async function main() {
  const files = await readDirectory(distDirectory);

  for (const file of files) {
    const parsed = path.parse(file);

    if (ignoreEntries.includes(parsed.base)) continue;

    if (parsed.ext === '.js' || parsed.ext === '.d.ts') await fs.remove(file).catch(console.error);
  }
}

async function readDirectory(entry) {
  try {
    const files = await fs.readdir(entry, { withFileTypes: true });
    const results = [];

    for (const file of files) {
      if (file.isDirectory()) {
        const entries = await readDirectory(path.join(entry, file.name));
        results.push(...entries);
      } else results.push(path.join(entry, file.name));
    }

    return results;
  } catch (error) {
    console.error('Failed to read directory:', entry);
    return [];
  }
}
