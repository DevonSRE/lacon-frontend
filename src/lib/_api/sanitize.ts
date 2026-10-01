import type { AxiosInstance } from "axios";

// The API currently includes credential fields (bcrypt hash, live OTP) in
// user records. Drop them server-side so they never reach the browser.
const SENSITIVE_KEYS = new Set([
  "password",
  "otp",
  "otpexpiresat",
  "otp_expires_at",
  "isotpverify",
  "is_otp_verify",
]);

export function stripSensitiveFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripSensitiveFields) as T;
  }
  // Only plain objects: leave Blobs, ArrayBuffers, Dates etc. untouched.
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !SENSITIVE_KEYS.has(key.toLowerCase()))
        .map(([key, v]) => [key, stripSensitiveFields(v)])
    ) as T;
  }
  return value;
}

export function stripSensitiveResponses(instance: AxiosInstance) {
  instance.interceptors.response.use((response) => {
    response.data = stripSensitiveFields(response.data);
    return response;
  });
}
