import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const TOKEN_KEY = 'access_token';

export const setCookie = (value, name = TOKEN_KEY) => {
  return cookies.set(name, value);
};

export const getCookie = (name = TOKEN_KEY) => {
  return cookies.get(name);
};

export const delCookie = (name = TOKEN_KEY) => {
  return cookies.remove(name, { path: '/' });
};
