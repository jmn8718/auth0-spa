import auth0 from "auth0-js";
import {
  AUTH_CONFIG,
  PRIVATE_PATH
} from "../../config";
import {
  history
} from "..";

const ACCESS_TOKEN = "access_token";
const EXPIRES_AT = "expires_at";
const ID_TOKEN = "id_token";
const TOKEN_TYPE = "token_type";

class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: "token id_token",
    scope: "openid profile"
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace(PRIVATE_PATH);
      } else if (err) {
        history.replace(PRIVATE_PATH);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(ID_TOKEN, authResult.idToken);
    localStorage.setItem(TOKEN_TYPE, authResult.tokenType);
    localStorage.setItem(EXPIRES_AT, expiresAt);
    // navigate to the home route
    history.replace(PRIVATE_PATH);
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ID_TOKEN);
    localStorage.removeItem(TOKEN_TYPE);
    localStorage.removeItem(EXPIRES_AT);
    // logout user in auth0
    this.auth0.logout({ returnTo: AUTH_CONFIG.returnTo });
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem(EXPIRES_AT));
    return new Date().getTime() < expiresAt;
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No Access Token found');
    }
    return accessToken;
  }

  getProfile() {
    let accessToken = this.getAccessToken();
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, function(err, profile) {
        if (profile) {
          resolve(profile)
        }
        reject(err);
      });
    })
  }

}

const auth = new Auth();

export default auth;