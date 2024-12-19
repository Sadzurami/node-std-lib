import fs, { Dirent } from 'fs-extra';
import PQueue from 'p-queue';
import path from 'path';

import { getSessionExpiryDate } from './helpers';
import { Account } from './interfaces/account.interface';
import { Secret } from './interfaces/secret.interface';
import { Session } from './interfaces/session.interface';
import {
  MoveSessionOptions,
  ReadAccountsOptions,
  ReadSecretsOptions,
  ReadSessionsOptions,
} from './types/resources.types';

export async function readSessions(dir: string, options?: ReadSessionsOptions): Promise<Session[]> {
  options = { ensure: true, ...options };

  let { validate } = options;
  validate = { version: { min: 2 }, expiry: true, ...validate };

  let entries: Dirent[] = [];
  try {
    if (options.ensure) await fs.ensureDir(dir);
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {}

  entries = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.steamsession'));
  if (entries.length === 0) return [];

  const sessions: Map<string, Session> = new Map();
  const files = entries.map((entry) => path.join(dir, entry.name));

  const queue = new PQueue({ concurrency: 512 });
  await queue.addAll(
    files.map((file) => async () => {
      try {
        const content = await fs.readFile(file, 'utf8').catch(() => '');
        const session = JSON.parse(content) as Session;

        if (typeof session !== 'object') return;

        if (validate.version) {
          if (typeof session.SchemaVersion !== 'number') return;

          if (validate.version.min && session.SchemaVersion < validate.version.min) return;
          if (validate.version.max && session.SchemaVersion > validate.version.max) return;
        }

        if (validate.expiry && getSessionExpiryDate(session) < new Date()) return;

        sessions.set(session.Username.toLowerCase(), session);
      } catch (error) {}
    }),
  );

  return [...sessions.values()];
}

export async function readAccounts(file: string, options?: ReadAccountsOptions): Promise<Account[]> {
  options = { ensure: true, ...options };

  let content: string = '';
  try {
    if (options.ensure) await fs.ensureFile(file);
    content = await fs.readFile(file, 'utf-8');
  } catch (error) {}

  const accounts: Map<string, Account> = new Map();

  for (const line of content.split(/\r?\n/)) {
    const parts = line.split(':');

    if (!parts[0] || !parts[1]) continue;
    const account: Account = { username: parts[0], password: parts[1], sharedSecret: null, identitySecret: null };

    if (parts[2] && Buffer.from(parts[2], 'base64').toString('base64') === parts[2]) account.sharedSecret = parts[2];
    if (parts[3] && Buffer.from(parts[3], 'base64').toString('base64') === parts[3]) account.identitySecret = parts[3];

    accounts.set(account.username.toLowerCase(), account);
  }

  return [...accounts.values()];
}

export async function readSecrets(dir: string, options?: ReadSecretsOptions): Promise<Secret[]> {
  options = { ensure: true, ...options };
  const filesRegexp = /\.mafile$|\.db$/i;

  let entries: Dirent[] = [];
  try {
    if (options.ensure) await fs.ensureDir(dir);
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {}

  entries = entries.filter((entry) => entry.isFile() && filesRegexp.test(entry.name));
  if (entries.length === 0) return [];

  const secrets: Map<string, Secret> = new Map();
  const files = entries.map((entry) => path.join(dir, entry.name));

  const queue = new PQueue({ concurrency: 512 });
  await queue.addAll(
    files.map((file) => async () => {
      try {
        let content = await fs.readFile(file, 'utf8').catch(() => '');
        content = content.replace(/},\s*}/g, '}}').replace(/'/g, '"');

        let json = JSON.parse(content) as Record<string, any>;
        if (typeof json !== 'object') return;

        json = json['_MobileAuthenticator'] ? json['_MobileAuthenticator'] : json;
        if (!json.shared_secret || !json.identity_secret) return;

        const secret: Secret = {
          username: json.account_name || path.basename(file).replace(filesRegexp, ''),
          sharedSecret: json.shared_secret,
          identitySecret: json.identity_secret,
        };

        secrets.set(secret.username.toLowerCase(), secret);
      } catch (error) {}
    }),
  );

  return [...secrets.values()];
}

export async function moveSession(src: string, dest: string, session: Session, options?: MoveSessionOptions) {
  options = { ensure: true, ...options };

  try {
    if (options.ensure) await fs.ensureDir(dest);

    src = path.join(src, `${session.Username}.steamsession`);
    dest = path.join(dest, `${session.Username}.steamsession`);

    await fs.move(src, dest);
  } catch (error) {
    throw new Error('Failed to move session', { cause: error });
  }
}
