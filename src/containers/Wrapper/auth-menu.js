import React from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

const AuthMenu = ({ isAuthenticated = false, login, logout, classes }) =>
  isAuthenticated ? (
    <Tooltip title="Logout" placement="bottom">
      <IconButton
        aria-owns="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={logout}
      >
        <AccountCircle />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      variant="contained"
      color="secondary"
      className={classes.button}
      onClick={login}
    >
      Login
    </Button>
  );

export default withStyles(styles)(AuthMenu);
