# Auth0 SPA

This project is a test exercise for [Auth0](https://auth0.com/) for a SPA using [React](https://reactjs.org/)

Requiments:
* node and npm
* [Auth0 account](https://auth0.com/)

Libraries (used on the project):
* [create react app](https://github.com/facebook/create-react-app#readme)
* [react router](https://reacttraining.com/react-router/web/guides/philosophy)
* [material ui](https://material-ui.com/)
* [auth0-js](https://github.com/auth0/auth0.js)

## Auth0 SPA Set up
Once you have an account, go to [Applications](https://manage.auth0.com/#/applications) section and create a new **Application**. \
Give a name to your application and select *Single Page Web Applications* and clicl on *Create*. \
![Image of Create Application](./images/01-app_setup.png)
This will create a new application, you can skip the previous step if you already have one application created. \

Next step is go to **Settings** tab, there we can get the keys to use in our application:
* Domain
* Client ID

In this section we also have to set up the *callback url*, where the client it is going to be redirected once the user login/signup in our application using auth0. \
For this step, scroll down to *Allowed Callback URLs* and set up the right value, in our demo case we will use ***http://localhost:3000/callback***.

We can also set up more than one value
```
http://localhost:3000/callback, http://10.0.71.166:3000/callback
```
We will set up this values in the **.env** file in our project.


## Project set up
We have to install the *auth0* library
```
# installation with npm
npm install --save auth0-js
```

On the *.env* we will set up the following values that we got from the Auth0 Application:
```
REACT_APP_NAME=Auth0 SPA
REACT_APP_DOMAIN=XXX.auth0.com
REACT_APP_CLIENT_ID=XXX
REACT_APP_ENDPOINT=XXX
REACT_APP_TOKEN_EXPIRATION=36000
```

## Authentication Controller
We have set up a controller to handle all the authentication flow.\
The object initializes the auth0 object with our app values.
```
import auth0 from "auth0-js";

...
class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: "token id_token",
    scope: "openid"
  })

  ...

  login() {
    this.auth0.authorize();
  }

  ...
}

const auth = new Auth();

export default auth;
```
Then we create an instance of the class and we export it so we can access to the object from different places in our app.

We use the localStorage to store the data of the user. Once the user logs out, we will clear this values.

## Handle login
In our application, we control the login and logout in the app bar. There we have set up a button that will allow the user to login.\
To login the user we have to user the *Authentication controller* we created.\
On the component, we use the login method:
```
  import { Auth } from "../../controllers";
  
  ...

  onLogin = () => {
    Auth.login();
  };

  ...
```
This action uses the auth0 library that will open our app screen in the domain of our app *https://XXX_YOUR_DOMAIN.auth0.com*
![Image of Login Screen](./images/02-app_login_screen.png)

## Handle Callback from Auth0
Once the user logs in (or signs up), auth0 will redirect the user to the callback endpoint we defined when we initialize the auth0 instance.\
To handle the data, we have defined a *Callback* container that handles the callback. It uses the Auth Controller to set up the user data that auth0 sends to the client
```
const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    Auth.handleAuthentication();
  }
};

const Callback = props => {
  handleAuthentication(props);

  return (
    <div style={STYLE}>
      <img src={loading} alt="loading" />
    </div>
  );
};
```
Once the controllers store the data in the localStorage, it will redirect the client to other route of our app, in this demo, we redirect to the dashboard page

## Handle logout
In order to logout the user, we will use auth0 logout function, so the token is revoked and can not be used anymore. More information in [Auth0 documentation](https://auth0.com/docs/logout).
First we should go to Auth0 [Application](https://manage.auth0.com/#/applications)'s page. Then we click on the app and go to `Allowed Logout URLs`, there we should set the url where we want to redirect the client after a success logout. For example, in we use localhost for development, we should set `http://localhost:3000`, so we redirect the user to the main page.
Then on the client side, we have to setup a logout function in our Auth Controller. We will remove the values from localstorage and the user auth0 object to call the logout endpoint.
```
  logout(redirect = false) {
    // Clear access token and ID token from local storage
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ID_TOKEN);
    localStorage.removeItem(TOKEN_TYPE);
    localStorage.removeItem(EXPIRES_AT);
    
    // logout user in auth0
    if (redirect) {
      this.auth0.logout({ returnTo: AUTH_CONFIG.returnTo });
    } else {
      this.auth0.logout();
    }
  }
```

## Refresh token
As the token has an expiration date, we might want to get a new token for the user without their interaction. For that we can use auth0 checkSession to request for a new one.
First we should go to Auth0 [Application](https://manage.auth0.com/#/applications)'s page. Then we click on the app and go to `Allowed Origins (CORS)` and `Allowed Web Origins`, there we should set the url where we are going to do the request. For example, in we use localhost for development, we should set `http://localhost:3000` as we will serve the client on that url, so the origins of the request will come from this url.
Then in our Auth controlle, we will define a function that will return the new token. Once we receive it, we will update the token in the localStorage.
```
checkSession() {
    return new Promise((resolve) => {
      this.auth0.checkSession(this.authorizationOptions, (err, data) => {
        if (err) {
          alert(`Error: ${err.error}. Check the console for further details.`);
        } else {
          localStorage.setItem(SESSION_TOKEN_DATA, JSON.stringify(data));
        }
        resolve();
      });
    });
  }
```
We can ask for a property on the `idToken` called `auth_time` that is the timestamp (in seconds) when the user authenticated. In order to get that we have to pass `max_age (seconds)` when we request the token on the **Login**.
```
this.auth0.authorize({ max_age: 3600 });
```
On the authorize, this value will not do anything but can be used later.
So if we request for a new token with *checkSession* if we pass also *max_age* on the request
```
this.auth0.checkSession({ max_age: 3600 }, (err, data) => 
```
It will check if the auth_time has exceeded the *max_age*, in that case it will return an error so the client can handle it according to the response. For example, if we want to restrict access to one page if the user was authenticated before X seconds, for example in order to the user to be able to update their profile, we use this checkSession to verify when the user logged last time in order to add some extra security.
