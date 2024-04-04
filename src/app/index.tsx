import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../store";
import App from "./app";
import "./bootstrap.min.css";

export const Root = () => (
  <Provider store={store}>
    <BrowserRouter basename="/otus-jsbasic-dz49-expenses">
      <App />
    </BrowserRouter>
  </Provider>
);
