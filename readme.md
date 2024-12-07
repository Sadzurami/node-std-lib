# std-lib

> Standard library for my projects

## Install

```sh
npm install @sadzurami/std-lib
```

## Usage

`main.ts`

```ts
import { raedConfig } from '@sadzurami/std-lib/config';
import { readProxies } from '@sadzurami/std-lib/proxy';
import { readSessions } from '@sadzurami/std-lib/steam';

(async () => {
  const config = await readConfig('path/to/config.json');
  console.log(`Config: ${config.origin}`);

  const proxies = await readProxies('path/to/proxies.txt');
  console.log(`Proxies: ${proxies.length}`);

  const sessions = await readSessions('path/to/sessions.dir');
  console.log(`Sessions: ${sessions.length}`);
})();
```
