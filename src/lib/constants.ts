export const DEFAULT_PAGE_SIZE = 10;

export const ALGORITHM = process.env.ALGORITHM as string
export const SECRET = process.env.SECRET_KEY as string
export const NEXT_BASE_URL = `${process.env.NEXT_BASE_URL as string}/api/v1`
export const NEXT_PUBLIC_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL as string}/api/v1`
// export const NEXT_PUBLIC_CASE_API_KEY = process.env.NEXT_PUBLIC_CASE_API_KEY as string
export const NEXT_PUBLIC_CASE_API_KEY = "sk_lTUW970qSRMWingiDjwzOK9ELdnbjltl1YDcYJKs120="

export const SUCCESS_STATUS = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226]
export const REDIRECT_STATUS = [300, 301, 302, 303, 304, 305, 306, 307, 308]
export const CLIENT_ERROR_STATUS = [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 426, 428, 429, 431, 451]
export const SERVER_ERROR_STATUS = [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511]
export interface Ipage {
    page?: number;
    size?: number;
    query?: string;
    zone?: string;
    keyword?: string;
    state?: string;
    centre?: string;
    status?: string;
    duration?: string
    user_type?: string
    type?: string,
    unit?: string
}
