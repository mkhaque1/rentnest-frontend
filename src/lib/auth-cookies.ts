import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const authCookies = {
  setTokens(accessToken: string, refreshToken: string) {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
      expires: 1,
      sameSite: 'strict',
    });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      expires: 7,
      sameSite: 'strict',
    });
  },
  getAccessToken() {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },
  clearTokens() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
};
