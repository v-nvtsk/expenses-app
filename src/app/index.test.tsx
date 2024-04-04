import { act, render, screen, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { APP_PREFIX } from "../api/expenses.types";
import { store } from "../store";
import App from "./app";

jest.mock("../api/firebase/firebase.ts");

describe("App", () => {
  beforeEach(async () => {
    localStorage.setItem(`${APP_PREFIX}@token`, "test_token");
  });

  it("should render root", async () => {
    await act(async () =>
      render(
        <Provider store={store}>
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
  });
});
