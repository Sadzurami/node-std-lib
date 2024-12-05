export function setProcessTitle(title: string) {
  if (process.platform === 'win32') process.title = title;
  else process.stdout.write('\x1b]2;' + title + '\x1b\x5c');
}
