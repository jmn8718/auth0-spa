import React from "react";
import { Router, Route, Redirect, Switch } from "react-router-dom";
import { Home, Callback, Dashboard, Details, Profile, AppWrapper as Wrapper } from "./containers";
import { Auth, history } from "./controllers";
import { PRIVATE_PATH, HOME_PATH, CALLBACK_PATH, DETAILS_PATH, PROFILE_PATH } from "./config";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: HOME_PATH,
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Routes = () => (
  <Router history={history}>
    <Wrapper>
      <Switch>
        <Route exact path={HOME_PATH} component={Home} />
        <Route exact path={CALLBACK_PATH} component={Callback} />
        <Route exact path={DETAILS_PATH} component={Details} />
        <PrivateRoute exact path={PROFILE_PATH} component={Profile} />
        <PrivateRoute exact path={PRIVATE_PATH} component={Dashboard} />
        <Redirect to={PRIVATE_PATH} />
      </Switch>
    </Wrapper>
  </Router>
);

export default Routes;
