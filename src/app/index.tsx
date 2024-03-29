import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./app";
import { store } from "../store";
import "./bootstrap.min.css";

export const Root = () => (
  <Provider store={store}>
    <BrowserRouter basename="/otus-jsbasic-dz49-expenses">
      <App />
    </BrowserRouter>
  </Provider>
);
