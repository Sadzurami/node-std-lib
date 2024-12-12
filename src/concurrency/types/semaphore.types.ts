export type SemaphoreOptions = {
  /**
   * Concurrency limit.
   *
   * @default 1
   */
  concurrency?: number;

  /**
   * Minimum amount of time in milliseconds between each tasks.
   *
   * @default 0
   */
  interval?: number;
};
