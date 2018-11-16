export const APP_ENDPOINT =
  process.env.REACT_APP_ENDPOINT || "http://localhost:3000";
export const CALLBACK_PATH = "/callback";
export const HOME_PATH = "/home";
export const PRIVATE_PATH = "/dashboard";
export const LOGOUT_CALLBACK_PATH = "";
export const DETAILS_PATH = "/details";
export const PROFILE_PATH = "/profile";

export const MAX_AUTH_TIME = 2 * 60; // 2 minutes, time in seconds

export const AUTH_CONFIG = {
  domain: process.env.REACT_APP_DOMAIN,
  clientId: process.env.REACT_APP_CLIENT_ID,
  callbackUrl: `${APP_ENDPOINT}${CALLBACK_PATH}`,
  returnTo: `${APP_ENDPOINT}${LOGOUT_CALLBACK_PATH}`,
  continue: `https://${process.env.REACT_APP_DOMAIN}/continue`
};
