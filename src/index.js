import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "./routes";
import CssBaseline from "@material-ui/core/CssBaseline";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <div>
    <CssBaseline />
    <Routes />
  </div>,
  document.getElementById("root")
);

registerServiceWorker();
