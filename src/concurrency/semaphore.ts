import PQueue from 'p-queue';
import { SemaphoreOptions } from './types/semaphore.options.type';

export default class Semaphore {
  public readonly queue: PQueue;

  constructor(options: SemaphoreOptions) {
    options = { concurrency: 1, interval: 0, ...options };
    this.queue = new PQueue({ ...options, intervalCap: options.concurrency });
  }

  public get size() {
    return this.queue.size + this.queue.pending;
  }

  public get free() {
    return this.queue.size === 0;
  }

  public get paused() {
    return this.queue.isPaused;
  }

  public get pending() {
    return this.queue.pending === 0;
  }

  public pause() {
    this.queue.pause();
  }

  public resume() {
    this.queue.start();
  }

  /**
   * Waits for the semaphore to be available.
   *
   * @returns A function that releases the semaphore.
   */
  public async acquire(): Promise<() => void> {
    await this.queue.onEmpty();

    let release: () => void;
    const promise = new Promise<void>((resolve) => (release = resolve));

    this.queue.add(() => promise);
    return release;
  }
}
