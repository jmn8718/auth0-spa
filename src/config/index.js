export const APP_ENDPOINT =
  process.env.REACT_APP_ENDPOINT || "http://localhost:3000";
export const CALLBACK_PATH = "/callback";
export const HOME_PATH = "/home";
export const PRIVATE_PATH = "/dashboard";
export const LOGOUT_CALLBACK_PATH = "";

export const AUTH_CONFIG = {
  domain: process.env.REACT_APP_DOMAIN,
  clientId: process.env.REACT_APP_CLIENT_ID,
  callbackUrl: `${APP_ENDPOINT}${CALLBACK_PATH}`,
  returnTo: `${APP_ENDPOINT}${LOGOUT_CALLBACK_PATH}`
};
