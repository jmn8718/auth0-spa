import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';

// import { Auth } from "../../controllers";
import { AUTH_CONFIG } from "../../config";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class Details extends Component {
  render() {
    const { classes, location } = this.props;
    return (
      <div>
        <Button variant="contained" color="primary" href={`${AUTH_CONFIG.continue}${location.search}`} className={classes.button}>
          Get Details
        </Button>
      </div>
    );
  }
}

Details.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Details);