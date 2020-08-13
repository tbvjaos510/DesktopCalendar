import React from "react";
import ReactDom from "react-dom";

const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const App = () => {
  return <h1>Hi from a react app2</h1>;
};

ReactDom.render(<App />, mainElement);
