export const APP_ENDPOINT =
  process.env.REACT_APP_ENDPOINT || "http://localhost:3000";
export const CALLBACK_PATH = "/callback";
export const HOME_PATH = "/home";
export const PRIVATE_PATH = "/dashboard";
export const LOGOUT_CALLBACK_PATH = "";
export const DETAILS_PATH = "/details";
export const PROFILE_PATH = "/profile";

export const MAX_AUTH_TIME = 200 * 60; // 2 minutes, time in seconds

function generateAuthConfiguration(zone = '') {
  const appendZone = zone ? `_${zone.toUpperCase()}` : '';
  return {
    domain: process.env[`REACT_APP_DOMAIN${appendZone}`],
    clientId: process.env[`REACT_APP_CLIENT_ID${appendZone}`],
    callbackUrl: `${APP_ENDPOINT}${CALLBACK_PATH}`,
    returnTo: `${APP_ENDPOINT}${LOGOUT_CALLBACK_PATH}`,
    continue: `https://${process.env[`REACT_APP_DOMAIN${appendZone}`]}/continue`,
    enableIdPInitiatedLogin: !!process.env[`REACT_APP_CLIENT_IDP_LOGIN_${ENV_KEY}`]
  };
}

const ENV_KEY = 'SA1'
export const AUTH_CONFIG = generateAuthConfiguration(ENV_KEY);
export const IDP_LOGIN = `${process.env[`REACT_APP_CLIENT_IDP_LOGIN_${ENV_KEY}`]}?redirect_uri=${AUTH_CONFIG.callbackUrl}`;