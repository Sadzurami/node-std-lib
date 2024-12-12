import PQueue from 'p-queue';
import { SemaphoreOptions } from './types/semaphore.options.type';

export default class Semaphore {
  public readonly queue: PQueue;

  constructor(options: SemaphoreOptions) {
    options = { concurrency: 1, interval: 0, ...options };
    this.queue = new PQueue({ ...options, intervalCap: options.concurrency });
  }

  public get free() {
    return this.queue.size === 0;
  }

  public get size() {
    return this.queue.size + this.queue.pending;
  }

  public get paused() {
    return this.queue.isPaused;
  }

  /**
   * Put semaphore on hold.
   */
  public pause() {
    this.queue.pause();
  }

  /**
   * Resumes semaphore.
   */
  public resume() {
    this.queue.start();
  }

  /**
   * Waits for semaphore to be available.
   *
   * @returns A function that releases semaphore.
   */
  public async acquire(): Promise<() => void> {
    await this.queue.onEmpty();

    let release: () => void;
    const promise = new Promise<void>((resolve) => (release = resolve));

    this.queue.add(() => promise);
    return release;
  }
}
