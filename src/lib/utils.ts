import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeToken(token: string) {
  const decoded = jwtDecode(token);
  return decoded;
}

type ApiErrorLike = {
  response?: { data?: { message?: string; data?: unknown } | string; status?: number };
  request?: unknown;
  message?: string;
};

export const handleApiError = (value: unknown) => {
  const error = (typeof value === "object" && value !== null ? value : {}) as ApiErrorLike;
  if (error.response) {
    const responseData = error.response.data;
    return {
      data: responseData,
      status: error.response.status ?? 500,
      message:
        (typeof responseData === "object" && responseData !== null ? responseData.message : undefined) ||
        (typeof responseData === "string" ? responseData : undefined) ||
        "An error occurred.",
      errors: typeof responseData === "object" && responseData !== null ? responseData.data ?? null : null,
      success: false,
    };
  }

  if (error?.request) {
    return {
      data: null,
      status: 504,
      message: "Something went wrong. Please try again.",
      errors: "Unable to process request.",
      success: false,
    };
  }

  if (error?.message) {
    return {
      status: 500,
      message: error.message,
      errors: error.message,
      success: false,
    };
  }

  return {
    data: null,
    status: 500,
    message: error?.message || "An unexpected error occurred.",
    errors: error?.message || "Unknown error.",
    success: false,
  };
};


