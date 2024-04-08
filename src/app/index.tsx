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
console.log("PUBLIC_PATH: ", window.PUBLIC_PATH);
console.log("process.env.PUBLIC_URL: ", process.env.PUBLIC_URL);

export const Root = () => (
  <Provider store={store}>
    <BrowserRouter basename={window.PUBLIC_PATH}>
      <App />
    </BrowserRouter>
  </Provider>
);
