import PQueue from 'p-queue';

import { SemaphoreOptions, SemaphorePermit } from './types/semaphore.types';

export class Semaphore {
  private readonly queue: PQueue;

  constructor(options: SemaphoreOptions = {}) {
    this.queue = new PQueue({ concurrency: 1, ...options });
  }

  /**
   * Returns `true` if semaphore is free, `false` otherwise.
   */
  public get free() {
    return this.size < this.concurrency;
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
   * @returns Semaphore permit.
   */
  public async acquire(): Promise<SemaphorePermit> {
    const release = await new Promise<() => void>((resolve) => {
      this.queue.add(async () => {
        await new Promise<void>((done) => resolve(() => done()));
      });
    });

    return { release };
  }
}
