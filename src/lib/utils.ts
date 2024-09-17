import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Gets the error message from an error object, handles different cases.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as {message: string}).message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An error occurred, please try again.";
};
