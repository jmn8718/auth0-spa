import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class TokenData extends Component {

  render() {
    const { data, title } = this.props;
    return (
      <div>
				{title && (
					<Typography component="h2">
						{title}
					</Typography>
				)}
        <Typography component="pre">
					{JSON.stringify(data.idTokenPayload, null, 2)}
				</Typography>
      </div>
    );
  }
}

TokenData.propTypes = {
	classes: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
	title: PropTypes.string
};

export default withStyles(styles)(TokenData);