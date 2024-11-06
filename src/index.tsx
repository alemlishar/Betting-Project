import React from "react";
import * as ReactDOM from "react-dom";
import App from "src/App";

if (process.env.NODE_ENV === "development") {
  ReactDOM.render(<App />, document.getElementById("root"));
}

export default App;
