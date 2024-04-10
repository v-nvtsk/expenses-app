import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../store";
import App from "./app";
import "./bootstrap.min.css";

declare const PUBLIC_PATH: string;

export const Root = () => (
  <Provider store={store}>
    <BrowserRouter basename={PUBLIC_PATH}>
      <App />
    </BrowserRouter>
  </Provider>
);
