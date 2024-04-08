import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../store";
import App from "./app";
import "./bootstrap.min.css";

declare global {
  interface Window {
    PUBLIC_PATH: string;
  }
}

export const Root = () => (
  <Provider store={store}>
    <BrowserRouter basename={window.PUBLIC_PATH}>
      <App />
    </BrowserRouter>
  </Provider>
);
