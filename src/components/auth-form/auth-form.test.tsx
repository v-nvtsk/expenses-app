import { RenderResult, fireEvent, render, screen } from "@testing-library/react";
import { AuthForm } from "./auth-form";

describe("AuthForm", () => {
  const onSubmitMock = jest.fn();
  const onChangeFormMock = jest.fn();

  let component: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;

  describe("SignInForm", () => {
    beforeEach(() => {
      component = render(<AuthForm activeForm={"signin"} onSubmit={onSubmitMock} onChangeForm={onChangeFormMock} />);
    });

    test("renders the sign-in form", () => {
      expect(
        screen.getByRole("heading", {
          name: /sign in/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("button").innerHTML).toBe("Sign in");

      expect(screen.getByText("Sign up")).toBeInTheDocument();

      expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    });

    test("calls onSubmit with email and password on form submission", () => {
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByPlaceholderText("Password");
      const button = screen.getByRole("button");
      expect(screen.getByText("Forgot password?")).toBeInTheDocument();

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(button);

      expect(onSubmitMock).toHaveBeenCalledWith("test@example.com", "password123");
    });

    test("not calls onSubmit with wrong email and password on form submission", () => {
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const passwordInput = screen.getByPlaceholderText("Password");
      const button = screen.getByRole("button");
      expect(screen.getByText("Forgot password?")).toBeInTheDocument();

      fireEvent.change(emailInput, { target: { value: "test" } });
      fireEvent.change(passwordInput, { target: { value: "passw" } });
      fireEvent.click(button);

      expect(onSubmitMock).not.toHaveBeenCalledWith("test@example.com", "password123");
    });

    it("should set error state on failure", () => {
      component.rerender(
        <AuthForm
          activeForm={"signin"}
          onSubmit={onSubmitMock}
          onChangeForm={onChangeFormMock}
          errorState="Error state"
        />,
      );

      const errorStateField = screen.getByText("Error state");
      expect(errorStateField).toBeInTheDocument();
    });
  });

  describe("SignUpForm", () => {
    beforeEach(() => {
      component = render(<AuthForm activeForm={"signup"} onSubmit={onSubmitMock} onChangeForm={onChangeFormMock} />);
    });

    test("renders the sign-up form", () => {
      expect(
        screen.getByRole("heading", {
          name: /sign up/i,
        }),
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("button").innerHTML).toBe("Sign up");

      expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    });
  });

  describe("change form", () => {
    test("calls onChangeForm with new form path", () => {
      component.unmount();
      component = render(<AuthForm activeForm={"signin"} onSubmit={onSubmitMock} onChangeForm={onChangeFormMock} />);

      const signUpBtn = screen.getByText("Sign up");
      expect(signUpBtn).toBeInTheDocument();

      fireEvent.click(signUpBtn);

      expect(onChangeFormMock).toHaveBeenCalledWith("/auth/signup");
    });
  });
});
