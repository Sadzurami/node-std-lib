export type SemaphoreOptions = {
  /**
   * Concurrency limit.
   *
   * @default 1
   */
  concurrency?: number;
};

export type SemaphorePermit = {
  /**
   * Release the semaphore.
   */
  release: () => void;
};
