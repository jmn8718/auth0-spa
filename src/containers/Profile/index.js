import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";

import { Auth } from "../../controllers";
import { TokenData } from '../../components';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class Profile extends Component {
  state = {
    session: {},
    isValid: false
  }

  componentWillMount() {
    this.getSession();
  }

  checkSession = async () => {
    await Auth.checkSession();
    this.getSession();
  }

  getSession = () => {
    this.setState({ session: Auth.getSession() });
    this.checkValidSession();
  }

  checkValidSession = () => {
    const isValid = Auth.isTokenMaxValid();
    this.setState({ isValid }, () => {
      if (!isValid) {
        debugger
        console.log('go to login')
        Auth.logout();
      }
    })
  }

  render() {
    const { session, isValid } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Typography component="h2">
          Profile ({isValid ? 'VALID' : 'INVALID'})
        </Typography>
        <Button variant="contained" color="primary" disabled={true} className={classes.button}>
          Save profile
        </Button>
        <Button variant="contained" onClick={this.checkSession} className={classes.button}>
          Check Session
        </Button>
        <div>
          {session.auth && (
            <TokenData data={session.auth} title="Auth" />
          )}
          {session.session && (
            <TokenData data={session.session} title="Session" />
          )}
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);