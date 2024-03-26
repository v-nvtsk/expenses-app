import { act, render, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Store } from "../../store";
import { Auth } from "./auth";
import firebase from "../../api/firebase/firebase";
import { AuthForm } from "../../components/auth-form";

const MockAuthFrom = jest.fn();

jest.mock("../../api/firebase/firebase");

describe("Calendar page", () => {
  beforeEach(() => {
    jest.mock("../../components/auth-form", () => ({
      AuthForm: (props: any) => MockAuthFrom(props),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render page with signin form", async () => {
    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <MemoryRouter initialEntries={["/signin"]}>
            <Routes>
              <Route
                path="/:action"
                element={
                  <Auth
                    authState={{
                      isAuthenticated: false,
                      isLoading: false,
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </Provider>,
      ),
    );
    expect(component.container).toBeInTheDocument();
    waitFor(() => {
      expect(MockAuthFrom).toHaveBeenCalledWith(expect.objectContaining({ activeForm: "signin" }));
    });

    component.unmount();
  });

  it("should render page with signup form", async () => {
    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <MemoryRouter initialEntries={["/signup"]}>
            <Routes>
              <Route
                path="/:action"
                element={
                  <Auth
                    authState={{
                      isAuthenticated: false,
                      isLoading: false,
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </Provider>,
      ),
    );
    expect(component.container).toBeInTheDocument();
    waitFor(() => {
      expect(MockAuthFrom).toHaveBeenCalledWith(expect.objectContaining({ activeForm: "signup" }));
    });

    component.unmount();
  });

  it("should render page with recover password form", async () => {
    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <MemoryRouter initialEntries={["/recover"]}>
            <Auth
              authState={{
                isAuthenticated: false,
                isLoading: false,
              }}
            />
          </MemoryRouter>
        </Provider>,
      ),
    );
    waitFor(() => {
      expect(MockAuthFrom).toHaveBeenCalledWith(expect.objectContaining({ activeForm: "recover" }));
    });
    component.unmount();
  });

  it.skip("should submit auth data", async () => {
    MockAuthFrom.mockImplementation((props: any) => <AuthForm {...props} />);
    const component = await act(async () =>
      render(
        <Provider store={Store}>
          <MemoryRouter initialEntries={["/signin"]}>
            <Auth
              authState={{
                isAuthenticated: false,
                isLoading: false,
              }}
            />
          </MemoryRouter>
        </Provider>,
      ),
    );

    waitFor(() => {
      expect(component.container).toBeInTheDocument();
    });

    const credentials = {
      email: "test@test.test",
      password: "123456",
    };

    const emailInput = component.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = component.getByLabelText(/password/i) as HTMLInputElement;

    emailInput.value = credentials.email;
    passwordInput.value = credentials.password;

    const btn = component.getByRole("button", { name: /sign in/i });
    expect(btn).toBeInTheDocument();

    jest.spyOn(firebase, "signIn").mockResolvedValue(null);
    btn.click();

    await waitFor(() => {
      expect(firebase.signIn).toHaveBeenCalledWith(credentials.email, credentials.password);
    });

    component.unmount();
  });
});
