/**
 * Returns a random number between min (inclusive) and max (exclusive).
 *
 * If no arguments are provided, defaults to a float between 0 and 1.
 *
 * If only one argument is provided, it is treated as the max value.
 *
 * If `min` is greater than `max`, they are swapped.
 *
 * If `float` is true (default), returns a float; otherwise, returns an integer.
 *
 */
export function random(min?: number, max?: number, float: boolean = true): number {
  if (max === undefined) [min, max] = [0, min ?? 1];

  if (min > max) [min, max] = [max, min];

  const value = Math.random() * (max - min) + min;

  return float ? value : Math.floor(value);
}

/**
 * Returns a random number between min (inclusive) and max (exclusive).
 *
 * If no arguments are provided, defaults to integer between 0 and 100.
 *
 * If `float` is true, returns a float; otherwise, returns an integer (default).
 */
export function noise(min: number = 0, max: number = 100, float: boolean = false): number {
  return random(min, max, float);
}

/**
 * Returns a backoff time in milliseconds based on the attempt number.
 *
 * Calculated as `2^(attempt - 1) * base`, with a maximum limit.
 *
 * If `base` is not provided, defaults to 1000 milliseconds.
 *
 * If `limit` is not provided, defaults to Infinity.
 *
 * If `attempt` is not defined or less than 1, returns 0.
 */
export function backoff(attempt?: number, base: number = 1000, limit: number = Infinity): number {
  if (!attempt || attempt < 1) return 0;

  return Math.min(2 ** (attempt - 1) * base, limit) || 0;
}
