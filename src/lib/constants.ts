export const SECRET_KEY: string = process.env.SECRET_KEY || "secret-key-string-here";
export const BASE_API_URL: string = `${process.env.BASE_API_URL}/api/v1` || "http://localhost:3000/api/v1";
export const ALGORITHM: string = process.env.ALGORITHM || "HS256";

export const STATUS_CODES = {
  SUCCESSFUL: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226],
  REDIRECTION: [300, 301, 302, 303, 304, 305, 306, 307, 308],
  CLIENT_ERROR: [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451],
  SERVER_ERROR: [500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511],
};
