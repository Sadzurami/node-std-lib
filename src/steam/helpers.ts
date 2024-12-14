import crypto from 'crypto';
import os from 'os';

import { Session } from './interfaces/session.interface';

export function getSessionExpiryDate(session: Session): Date {
  try {
    const timestamp = Math.min(
      decodeRefreshToken(session.WebRefreshToken).exp,
      decodeRefreshToken(session.MobileRefreshToken).exp,
      decodeRefreshToken(session.DesktopRefreshToken).exp,
    );

    return new Date(timestamp * 1000);
  } catch (error) {
    throw new Error('Failed to get session expiry date', { cause: error });
  }
}

export function decodeRefreshToken(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token must have 3 parts');

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payloadString = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const payloadJson = JSON.parse(payloadString);

    return payloadJson as { iss: string; sub: string; aud: string[]; exp: number };
  } catch (error) {
    throw new Error('Failed to decode refresh token', { cause: error });
  }
}

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
