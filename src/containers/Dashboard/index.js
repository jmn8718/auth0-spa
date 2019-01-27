import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { Auth } from "../../controllers";
import { TokenData } from '../../components';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  card: {
    // maxWidth: 400,
  },
  button: {
    margin: theme.spacing.unit,
  },
  avatar: {
    margin: 10,
    width: 60,
    height: 60
  }
})

const STYLE = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: 'center',
  height: "100vh",
  width: "100vw",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "white"
};

class MenuAppBar extends Component {
  state = {
    ready: false,
    user: undefined,
    session: {}
  };

  componentDidMount() {
    if (Auth.isAuthenticated()) {
      this.getUserInfo();
    }
  }

  getUserInfo = async () => {
    let user = await Auth.getProfile();
    this.setState({ ready: true, user });
  }

  checkSession = async () => {
    await Auth.checkSession();
    this.getSession()
  }

  getSession = () => {
    this.setState({ session: Auth.getSession() });
  }

  render() {
    const {
      ready, user, session
    } = this.state
    const { classes } = this.props
    if (!ready) {
      return <div style={STYLE}><CircularProgress className={classes.progress} size={50} /></div>
    }
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar alt={user.nickname} src={user.picture} className={classes.avatar} />
            }
            title={user.name}
          />
          <CardContent>
            <Typography component="pre">
              {JSON.stringify(user, null, 2)}
            </Typography>
          </CardContent>
        </Card>
        <Button variant="contained" href="/profile" className={classes.button}>
          Profile
        </Button>

        <Button variant="contained" onClick={this.checkSession} className={classes.button}>
          Check Session
        </Button>

        <Button variant="contained" onClick={this.getSession} className={classes.button}>
          Get Session
        </Button>
        {session.idToken && <h2>{session.idToken}</h2>}
        {session.auth && (
          <TokenData data={session.auth} title="Auth" />
        )}
        {session.session && (
          <TokenData data={session.session} title="Session" />
        )}
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MenuAppBar);