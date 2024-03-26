import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useLayoutEffect } from "react";
import { Main } from "./main/main";
import { Auth } from "./auth/auth";
import { Settings } from "./settings";
import { Header } from "../components/header/header";
import { AuthState, checkAuth, signOut } from "../store/authSlice";
import { AppDispatch, StoreRootState } from "../store";
import { Private } from "../containers/private";
import { Stats } from "./stats";
import { About } from "./about";

function App() {
  sessionStorage.getItem("token");

  const authState = useSelector<StoreRootState>((state) => state.auth) as AuthState;
  const { isLoading, isAuthenticated } = authState;
  const dispatch = useDispatch<AppDispatch>();

  useLayoutEffect(() => {
    dispatch(checkAuth());
  }, []);

  const callbacks = {
    onSignOut() {
      dispatch(signOut());
    },
  };

  return (
    !isLoading && (
      <>
        <Header onSignOut={callbacks.onSignOut} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="stats"
            element={
              <Private isAuthenticated={isAuthenticated}>
                <Stats />
              </Private>
            }
          />
          <Route path="auth/:action" element={<Auth authState={authState} />} />
          <Route
            path="settings"
            element={
              <Private isAuthenticated={isAuthenticated}>
                <Settings />
              </Private>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </>
    )
  );
}

export default App;
