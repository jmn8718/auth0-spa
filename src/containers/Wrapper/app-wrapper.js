import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { Auth } from "../../controllers";
import AuthMenu from "./auth-menu";
import ContentWrapper from "./content-wrapper";

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  }
};

class Wrapper extends Component {
  state = {};

  onLogin = () => {
    Auth.login();
  };

  onLogout = () => {
    Auth.logout();
  };

  render() {
    const { classes, children } = this.props;
    const isAuthenticated = Auth.isAuthenticated();
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              {process.env.REACT_APP_NAME}
            </Typography>
            <AuthMenu
              isAuthenticated={isAuthenticated}
              login={this.onLogin}
              logout={this.onLogout}
            />
          </Toolbar>
        </AppBar>
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    );
  }
}

Wrapper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Wrapper);
