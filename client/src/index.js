import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter"; // make sure path is correct

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
