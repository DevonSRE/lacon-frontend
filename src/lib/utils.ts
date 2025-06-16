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

export const handleApiError = (error: any) => {
  if (error?.response) {
    return {
      data: error.response.data,
      status: error.response.status,
      message:
        error.response.data?.message ||
        error.response.data ||
        "An error occurred.",
      errors: error.response.data?.data || null,
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


