import {BASE_URL} from "@/constants";
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

// Custom Fetch Function for API calls

type FetchOptions = RequestInit & {
  next?: NextFetchRequestConfig;
};

const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const log = (message: string, data?: any) => {
  if (isLocalhost) {
    console.log(message, data);
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const logError = (message: string, data?: any) => {
  if (isLocalhost) {
    console.error(message, data);
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const logDebug = (message: string, data?: any) => {
  if (isLocalhost) {
    console.debug(message, data);
  }
};

export async function fetchApi<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const {next, ...fetchOptions} = options;
  const fullUrl = `${BASE_URL}${url}`;

  log(`Initiating API call to: ${fullUrl}`, {options: fetchOptions});

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      next: next ? {revalidate: next.revalidate} : undefined,
    });

    log(`Received response from: ${fullUrl}`, {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      logError(`HTTP error for: ${fullUrl}`, {
        status: response.status,
        statusText: response.statusText,
      });
      return {} as T;
    }

    const data = await response.json();
    logDebug(`Parsed JSON response from: ${fullUrl}`, {data});

    return data;
  } catch (error: unknown) {
    logError(`Error in API call to: ${fullUrl}`, {
      error,
      message: (error as Error).message,
      cause: (error as Error).cause,
      stack: (error as Error).stack,
    });

    return {} as T;
  }
}
