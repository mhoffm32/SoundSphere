// index.jsx or App.jsx
import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./AppRouter"; // adjust path if needed

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById("root")
);
