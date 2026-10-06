export const errorMessages = {
  USER: {
    NOT_FOUND: "User not found.",
    ALREADY_EXISTS: "User already exists.",
  },
  TELEGRAM: {
    INIT_DATA_NOT_PROVIDED: "Telegram connection error: initData was not provided.",
    INVALID_INIT_DATA: "Telegram connection error: initData is invalid.",
    INVALID_AUTH_HEADERS: "Telegram connection error: invalid Authorization header format.",
  },
  PRISMA: {
    RECORD_NOT_FOUND: (target?: string) => `${target ?? "Required record"} not found`,
    UNIQUE_CONSTRAINT: (target?: string) =>
      `${target ?? "A record with this value"} already exists`,
    VALUE_TOO_LONG: (column?: string) =>
      `The provided value for the column is too long for the column ${column ?? "type"}`,
    FOREIGN_KEY_CONSTRAINT: "Foreign key constraint failed",
    VALIDATION_FAILED: "Data validation error",
    CONNECTION_TIMEOUT: "Operations timed out. Could not connect to the database server",
    CANNOT_REACH_DB: "Database server connection error",
  },
};
