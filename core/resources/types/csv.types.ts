export type ReadCsvOptions = {
  /**
   * Ensures that the file exists.
   *
   * @default true
   */
  ensure?: boolean;

  /**
   * Convert types to their respective values.
   *
   * @default true
   */
  convert?: boolean;
};

export type SaveCsvOptions = {
  /**
   * Ensures that the file exists.
   *
   * @default true
   * */
  ensure?: boolean;
};
