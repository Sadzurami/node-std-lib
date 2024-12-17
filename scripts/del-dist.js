/* eslint-disable */

const fs = require('fs-extra');
const path = require('path');

const distDirectory = path.join(__dirname, '..');
const ignoreEntries = ['node_modules', 'scripts'];

main();
async function main() {
  const files = await readDirectory(distDirectory);

  for (const entry of files) {
    if (path.basename(entry).startsWith('.')) continue;

    if (ignoreEntries.some((el) => entry.includes(el))) continue;

    if (entry.endsWith('.js') || entry.endsWith('.d.ts')) await fs.remove(entry).catch(console.error);
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
      } else {
        results.push(path.join(entry, file.name));
      }
    }

    return results;
  } catch (error) {
    return [];
  }
}
