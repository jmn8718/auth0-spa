import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    flexGrow: 1,
    margin: 8
  }
};

const ContentWrapper = ({ classes, children }) => {
  return <div className={classes.root}>{children}</div>;
};

ContentWrapper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContentWrapper);
