import React from "react";
import { NavLink } from "react-router-dom";

type HeaderProps = {
  isAuthenticated: boolean;
  onSignOut: () => void;
};

export function Header({ isAuthenticated, onSignOut }: HeaderProps): React.ReactElement {
  const signOutHandler = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    onSignOut();
  };

  const callbacks = {
    toggleBurger: () => {
      document.querySelector(".navbar-collapse")?.classList.toggle("show");
    },
  };

  return (
    <header className="page__header header">
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
              Expenses App
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarColor01"
              aria-controls="navbarColor01"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={callbacks.toggleBurger}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor01">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="expenses">
                    Expenses
                  </NavLink>
                </li>
                {isAuthenticated && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="settings">
                      Settings
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink className="nav-link" to="about">
                    About
                  </NavLink>
                </li>

                {!isAuthenticated && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="auth/signin">
                      Sign In
                    </NavLink>
                  </li>
                )}
                {!isAuthenticated && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="auth/signup">
                      Sign Up
                    </NavLink>
                  </li>
                )}
                {isAuthenticated && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="auth/signout" onClick={signOutHandler}>
                      Sign Out
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
