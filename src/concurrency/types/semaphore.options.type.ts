export type SemaphoreOptions = {
  /**
   * Concurrency limit.
   *
   * @default 1
   */
  concurrency?: number;

  /**
   * The length of time in milliseconds before the interval count resets.
   *
   * @default 0
   */
  interval?: number;
};
