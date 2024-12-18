import crypto from 'crypto';
import os from 'os';

export function createMachineName(username?: string): string {
  const hash = crypto.createHash('sha1');
  hash.update(username || os.hostname());

  const sha1 = hash.digest();
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let output = 'DESKTOP-';
  for (let i = 0; i < 7; i++) output += CHARS[sha1[i] % CHARS.length];

  return output;
}

export function createMachineId(username?: string): Buffer {
  const id = username || os.hostname();

  return Buffer.concat([
    byteToBuffer(0),
    stringToBuffer('MessageObject'),

    byteToBuffer(1),
    stringToBuffer('BB3'),
    stringToBuffer(sha1(`SteamUser Hash BB3 ${id}`)),

    byteToBuffer(1),
    stringToBuffer('FF2'),
    stringToBuffer(sha1(`SteamUser Hash FF2 ${id}`)),

    byteToBuffer(1),
    stringToBuffer('3B3'),
    stringToBuffer(sha1(`SteamUser Hash 3B3 ${id}`)),

    byteToBuffer(8),
    byteToBuffer(8),
  ]);

  function sha1(input: string) {
    const hash = crypto.createHash('sha1');
    hash.update(input, 'utf8');
    return hash.digest('hex');
  }

  function stringToBuffer(input: string) {
    const buffer = Buffer.from(input, 'utf8');
    return Buffer.concat([buffer, Buffer.from('00', 'hex')]);
  }

  function byteToBuffer(input: number) {
    const buffer = Buffer.alloc(1);
    buffer[0] = input;
    return buffer;
  }
}
