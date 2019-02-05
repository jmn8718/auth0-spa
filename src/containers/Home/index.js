import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import { IDP_LOGIN } from '../../config';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class Home extends Component {
  state = {};
  render() {
    const { classes } = this.props;
    return (
      <div>
        <h2>Home</h2>
        
        {IDP_LOGIN && <Button
          variant="contained"
          color="primary"
          href={IDP_LOGIN}
          className={classes.button}
        >
          Initiate IdP
        </Button>}
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
