export type ReadAccountsOptions = {
  /**
   * Ensures that the file exists.
   *
   * @default true
   */
  ensure?: boolean;
};

export type ReadSecretsOptions = {
  /**
   * Ensures that the directory exists.
   *
   * @default true
   */
  ensure?: boolean;
};

export type ReadSessionsOptions = {
  /**
   * Ensures that the directory exists.
   *
   * @default true
   */
  ensure?: boolean;

  /**
   * Ensures that the session is valid.
   *
   */
  validate?: ValidateSessionOptions;
};

export type ValidateSessionOptions = {
  /**
   * Minimum schema version.
   *
   * @default min: 2
   */
  version?: { min?: number; max?: number };

  /**
   * Ensures that the session is not expired.
   *
   * @default true
   */
  expired?: boolean;
};

export type MoveSessionOptions = {
  /**
   * Ensures that the directory exists.
   *
   * @default true
   */
  ensure?: boolean;
};
