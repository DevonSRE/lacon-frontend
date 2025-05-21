import { SignJWT, jwtVerify } from 'jose'
import { cookies, headers } from 'next/headers'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { TSessionData, TFullUser } from '@/lib/types'
import { ALGORITHM, SECRET_KEY } from '@/lib/constants'
import { decodeToken } from '@/lib/utils'

const key = new TextEncoder().encode(SECRET_KEY)
type TJwtPayload = TSessionData & {
  expires: number;
};

type TCookieHelper = {
  name: string;
  options: Partial<ResponseCookie>;
  duration: number;
}
const cookieHelper: TCookieHelper = {
  name: 'session',
  options: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  },
  duration: 24 * 60 * 60 * 1000,
}


const auth = {
  user: <TFullUser | null>null,
  tokens: null,
  sessionCookie: null,
  cookieStore: await cookies(),



  encrypt: async (payload: TJwtPayload) => {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .sign(key);
  },

  decrypt: async (session: string): Promise<TJwtPayload | null> => {
    try {
      const { payload } = await jwtVerify<TJwtPayload>(session, key, {
        algorithms: [ALGORITHM],
      });
      return payload;
    } catch {
      return null;
    }
  },


verifySession: async () => {
  const cookie = auth.cookieStore.get(cookieHelper.name)?.value;

  if (!cookie) return null;

  const session = await auth.decrypt(cookie);
  return session as TSessionData | null;
},


  createSession: async (userData: TSessionData) => {
    const decryptedToken = decodeToken(userData.token);

    const expires = decryptedToken.exp
      ? decryptedToken.exp * 1000
      : Date.now() + cookieHelper.duration;

    const session = await auth.encrypt({ ...userData, expires });

    auth.cookieStore.set(cookieHelper.name, session, {
      ...cookieHelper.options,
      expires: new Date(expires), // This must be a `Date` for `set()` to work
    });
  },


  deleteSession: () => {
    auth.cookieStore.delete(cookieHelper.name)
    // redirect('/login') // would prefer this but server action will return an error instead
  },

  getUser: async () => {
    const session = await auth.verifySession()
    return session?.user?.id
  },

  getToken: async () => {
    const session = await auth.verifySession()
    return session?.token
  },
}


export default auth


export const getBaseUrl = async () => {
  const headerStore = await headers()
  const host = headerStore.get('host');
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
};
