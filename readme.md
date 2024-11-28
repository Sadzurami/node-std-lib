# std-lib

> Standard library for my projects

## Install

```sh
yarn add @sadzurami/std-lib
```

## Usage

`main.ts`

```ts
import { readSessions } from '@sadzurami/std-lib/steam/files';

(async () => {
  const sessions = await readSessions('path/to/sessions.dir');
  console.log(`Sessions: ${sessions.length}`);
})();
```
