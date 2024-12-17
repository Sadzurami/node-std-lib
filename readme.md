# std-lib

> Standard library for my projects

## Install

```sh
npm install @sadzurami/std-lib
```

## Usage

```ts
import { readSessions } from '@sadzurami/std-lib/steam';
import { readConfig, readProxies } from '@sadzurami/std-lib/resources';

(async () => {
  const config = await readConfig('path/to/config.json');
  console.log(`Config: ${config.origin}`);

  const proxies = await readProxies('path/to/proxies.txt');
  console.log(`Proxies: ${proxies.length}`);

  const sessions = await readSessions('path/to/sessions.dir');
  console.log(`Sessions: ${sessions.length}`);
})();
```
