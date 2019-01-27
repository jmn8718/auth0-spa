import React from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { withStyles } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  avatar: {
    height: 36,
    width: 36
  },
  button: {
    margin: theme.spacing.unit
  }
});

const AuthMenu = ({ isAuthenticated = false, user = {}, login, logout, classes }) =>
  isAuthenticated ? (
    <Tooltip title="Logout" placement="bottom">
      <IconButton
        aria-owns="menu-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={logout}
      >
        { user && user.picture ?
          <Avatar alt={user.nickname} src={user.picture} className={classes.avatar} /> :
          <AccountCircle />
        }
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
