import React, { Fragment } from "react";

import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuBootstrap from "./MenuBootstrap";
import GiaPhaDemo from "./GiaPhaDemo";

function App() {
  return (
    <Fragment>
      <MenuBootstrap />
      <GiaPhaDemo />
    </Fragment>
  );
}

export default App;
