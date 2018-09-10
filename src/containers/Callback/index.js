import React from "react";
import loading from "./loading.svg";

import { Auth } from "../../controllers";

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    Auth.handleAuthentication();
  }
};

const STYLE = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "white"
};

const Callback = props => {
  handleAuthentication(props);

  return (
    <div style={STYLE}>
      <img src={loading} alt="loading" />
    </div>
  );
};

export default Callback;
