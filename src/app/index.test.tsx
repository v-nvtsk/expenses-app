import { act, render, screen, within } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Store } from "../store";
import App from "./app";

jest.mock("../api/firebase/firebase.ts");

describe("App", () => {
  it("should render root", async () => {
    const app = await act(async () =>
      render(
        <Provider store={Store}>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </Provider>,
      ),
    );

    const navigation = screen.getByRole("navigation");
    expect(navigation).toBeInTheDocument();

    const unauthorizedHeader = screen.getByRole("heading", { name: /you are not authorized/i });
    expect(unauthorizedHeader).toBeInTheDocument();

    const list = within(navigation).getByRole("list");
    expect(list).toBeInTheDocument();

    const linkSignIn = within(list).getByRole("link", {
      name: /sign in/i,
    });
    expect(list).toContainElement(linkSignIn);

    app.unmount();
  });
});
