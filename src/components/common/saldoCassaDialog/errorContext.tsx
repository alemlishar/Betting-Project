import React, { createContext, useContext, ReactNode, useState } from "react";
import { ErrorType, UpdateErrorType } from "./errorType";
export const ErrorContext = createContext<ErrorType>({ active: false, prelevare: false, type: null, message: null });
export const UpdateErrorContext = createContext<UpdateErrorType>({ setError: (error: ErrorType) => {} });
export function useErrorContext() {
  return useContext(ErrorContext);
}

export function useUpdateErrorContext() {
  return useContext(UpdateErrorContext);
}

export default function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<ErrorType>({ active: false, prelevare: false, type: null, message: null });

  return (
    <ErrorContext.Provider value={error}>
      <UpdateErrorContext.Provider value={{ setError }}>{children}</UpdateErrorContext.Provider>
    </ErrorContext.Provider>
  );
}
