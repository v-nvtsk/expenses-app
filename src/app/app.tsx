import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Header } from "../components/header/header";
import { Private } from "../containers/private";
import { AppDispatch, StoreRootState } from "../store";
import { AuthState, checkAuth, signOut } from "../store/authSlice";
import { About } from "./about";
import { Auth } from "./auth/auth";
import { Main } from "./main/main";
import { Settings } from "./settings";
import { Stats } from "./stats";

function App() {
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
