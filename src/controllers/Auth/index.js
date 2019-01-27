import auth0 from "auth0-js";
import {
  AUTH_CONFIG,
  PRIVATE_PATH,
  MAX_AUTH_TIME
} from "../../config";
import {
  history
} from "..";

const ACCESS_TOKEN = "access_token";
const EXPIRES_AT = "expires_at";
const ID_TOKEN = "id_token";
const TOKEN_TYPE = "token_type";

const AUTH_TOKEN_DATA = "auth";
const SESSION_TOKEN_DATA = "session";

class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: "token id_token",
    scope: "openid profile"
  });

  constructor(options = {}) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.authorizationOptions = options;
  }

  login() {
    this.auth0.authorize(this.authorizationOptions);
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace(PRIVATE_PATH);
        localStorage.setItem(AUTH_TOKEN_DATA, JSON.stringify(authResult));
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

  logout(redirect = false) {
    // Clear access token and ID token from local storage
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ID_TOKEN);
    localStorage.removeItem(TOKEN_TYPE);
    localStorage.removeItem(EXPIRES_AT);

    localStorage.removeItem(AUTH_TOKEN_DATA);
    localStorage.removeItem(SESSION_TOKEN_DATA);
    // logout user in auth0
    if (redirect) {
      this.auth0.logout({ returnTo: AUTH_CONFIG.returnTo });
    } else {
      this.auth0.logout();
    }
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem(EXPIRES_AT));
    return new Date().getTime() < expiresAt;
  }

  isTokenMaxValid() {
    const { auth, session } = this.getSession();
    if (!auth.idTokenPayload) {
      return false;
    } else {
      let auth_time = 0;
      if (session.idTokenPayload) {
        auth_time = session.idTokenPayload.auth_time || auth_time;
      } else { // we only have auth
        auth_time = auth.idTokenPayload.auth_time || auth_time;
      }
      if (!auth_time) {
        console.error('NO AUTH_TIME', auth_time)
        return false;
      }
      const max_auth_time = (auth_time + MAX_AUTH_TIME) * 1000;
      return max_auth_time > Date.now();
    }
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No Access Token found');
    }
    return accessToken;
  }

  getIdToken() {
    const idToken = localStorage.removeItem(ID_TOKEN);
    return idToken || 'no_id_token';
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

  checkSession() {
    return new Promise((resolve) => {
      this.auth0.checkSession(this.authorizationOptions, (err, data) => {
        if (err) {
          console.log(err);
          alert(`Error: ${err.error}. Check the console for further details.`);
        } else {
          localStorage.setItem(SESSION_TOKEN_DATA, JSON.stringify(data));
        }
        resolve();
      });
    });
  }

  getSession() {
    const authData = localStorage.getItem(AUTH_TOKEN_DATA) || '{}';
    const sessionData = localStorage.getItem(SESSION_TOKEN_DATA) || '{}';
    return {
      auth: JSON.parse(authData),
      session: JSON.parse(sessionData),
      idToken: localStorage.getItem(ID_TOKEN) || 'no_id_token'
    }
  }

}

const auth = new Auth({
  max_age: MAX_AUTH_TIME
});

export default auth;