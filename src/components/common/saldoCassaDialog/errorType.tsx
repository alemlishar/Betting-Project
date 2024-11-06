export type ErrorType = {
  type: String | null;
  prelevare: boolean | null;
  active: boolean;
  message: String | null;
};

export type UpdateErrorType = {
  setError: (error: ErrorType) => void;
};
