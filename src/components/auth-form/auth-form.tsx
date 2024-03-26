import React, { useRef } from "react";
import styles from "./style.module.css";

const formOptions: Record<string, any> = {
  signin: {
    title: "Sign in",
    altForm: "signup",
    altHref: "/auth/signup",
    altTitle: "Sign up",
  },
  signup: {
    title: "Sign up",
    altForm: "signin",
    altHref: "/auth/signin",
    altTitle: "Sign in",
  },
  recover: {
    title: "Recover",
    altForm: "signin",
    altHref: "/auth/signin",
    altTitle: "Sign in",
  },
};

type AuthFormProps = {
  activeForm: string;
  onSubmit: (email: string, password: string) => void;
  onChangeForm: (form: string) => void;
  errorState?: string;
};

export function AuthForm({ activeForm, onSubmit, onChangeForm, errorState }: AuthFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const callbacks = {
    onSubmit: (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const form = formRef.current as HTMLFormElement;
      if (form.checkValidity()) {
        const emailEl = form.elements.namedItem("email") as HTMLInputElement;
        const passwordEl = form.elements.namedItem("password") as HTMLInputElement;
        onSubmit(emailEl.value, passwordEl.value);
      }
    },
    changeForm(ev: React.MouseEvent<HTMLAnchorElement>) {
      ev.preventDefault();
      const target = ev.target as HTMLAnchorElement;
      onChangeForm(target.pathname);
    },
  };

  const form = formOptions[activeForm];
  return (
    <div className={styles.auth}>
      <form id="auth-form" className={styles.form} noValidate onSubmit={callbacks.onSubmit} ref={formRef}>
        <h1 className={styles.title}>{form.title}</h1>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input type="email" name="email" id="email" className={styles.inputField} placeholder="Email" required />
        </div>
        {activeForm !== "recover" && (
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              minLength={6}
              className={styles.inputField}
              placeholder="Password"
              required
            />
          </div>
        )}
        {errorState && <p className={styles.error}>{errorState}</p>}
        <div className={styles.btnGroup}>
          <button type="submit" className={[styles.btn, styles.btnSubmit].join(" ")}>
            {form.title}
          </button>
        </div>
        <div className={styles.linkGroup}>
          <a href={form.altHref} className={styles.change} onClick={callbacks.changeForm}>
            {form.altTitle}
          </a>
          {activeForm !== "recover" && (
            <a href="/auth/recover" className={styles.recover} onClick={callbacks.changeForm}>
              Forgot password?
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
