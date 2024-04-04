import { RenderResult, act, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import firebase from "../../api/firebase/firebase";
import { AuthForm } from "../../components/auth-form";
import { store } from "../../store";
import { Auth } from "./auth";

const MockAuthForm = jest.fn();

jest.mock("../../api/firebase/firebase");

describe("Calendar page", () => {
  beforeEach(() => {
    jest.mock("../../components/auth-form", () => ({
      AuthForm: (props: any) => MockAuthForm(props),
    }));
    MockAuthForm.mockImplementation((props: any) => <AuthForm {...props} />);
  });

  let component: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;

  it("should render page with signin form", async () => {
    component = await act(async () =>
      render(
        <Provider store={store}>
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
      expect(MockAuthForm).toHaveBeenCalledWith(expect.objectContaining({ activeForm: "signin" }));
    });
  });

  it("should render page with signup form", async () => {
    component = await act(async () =>
      render(
        <Provider store={store}>
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
      expect(MockAuthForm).toHaveBeenCalledWith(expect.objectContaining({ activeForm: "signup" }));
    });
  });

  it("should render page with recover password form", async () => {
    await act(async () =>
      render(
        <Provider store={store}>
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
      expect(MockAuthForm).toHaveBeenCalledWith(expect.objectContaining({ activeForm: "recover" }));
    });
  });

  it("should submit auth data", async () => {
    component = await act(async () =>
      render(
        <Provider store={store}>
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

    waitFor(async () => {
      expect(component.container).toBeInTheDocument();

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
    });
  });
});
