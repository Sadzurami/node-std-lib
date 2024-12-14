import PQueue from 'p-queue';

import { SemaphoreOptions } from './types/semaphore.types';

export class Semaphore {
  private readonly queue: PQueue;

  constructor(options: SemaphoreOptions = {}) {
    this.queue = new PQueue({ concurrency: 1, ...options });
  }

  /**
   * Returns `true` if semaphore is free, `false` otherwise.
   */
  public get free() {
    return this.queue.size === 0 && this.queue.pending < this.concurrency;
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
   * Returns the concurrency limit.
   */
  public get concurrency() {
    return this.queue.concurrency;
  }

  /**
   * Sets the concurrency limit.
   */
  public set concurrency(concurrency: number) {
    this.queue.concurrency = concurrency;
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
