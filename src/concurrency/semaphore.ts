import PQueue from 'p-queue';
import { SemaphoreOptions } from './types/semaphore.options.type';

export class Semaphore {
  private readonly queue: PQueue;

  constructor(options: SemaphoreOptions = {}) {
    options = { concurrency: 1, interval: 0, ...options };
    this.queue = new PQueue({ ...options, intervalCap: options.concurrency });
  }

  /**
   * Returns `true` if semaphore is free, `false` otherwise.
   */
  public get free() {
    return this.queue.size === 0;
  }

  /**
   * Returns the number of enqueued tasks.
   */
  public get size() {
    return this.queue.size + this.queue.pending;
  }

  /**
   * Returns `true` if semaphore is paused, `false` otherwise.
   */
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
