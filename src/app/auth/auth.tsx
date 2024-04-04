import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthForm } from "../../components/auth-form";
import { AppDispatch } from "../../store";
import { AuthState, resetPassword, signIn, signUp } from "../../store/authSlice";
import "./style.css";

type Props = {
  authState: Partial<AuthState>;
};

export function Auth({ authState }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const activeForm = params.action || "";
  const from = location.state !== null ? location.state.from : null;
  const dispatch = useDispatch<AppDispatch>();

  useLayoutEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      if (location.state && location.state.from !== null) navigate(-1);
      else navigate("/");
    }
  }, [authState.isAuthenticated]);

  const callbacks = {
    onSubmit: (email: string, password: string) => {
      if (activeForm === "signin") dispatch(signIn({ email, password }));
      else if (activeForm === "signup") dispatch(signUp({ email, password }));
      else if (activeForm === "recover") dispatch(resetPassword({ email }));
    },
    changeForm(pathname: string) {
      navigate(pathname, { replace: true, state: { state: from } });
    },
  };

  if (["signin", "signup", "recover"].includes(activeForm)) {
    return (
      !authState.isLoading &&
      !authState.isAuthenticated && (
        <div className="page__auth">
          <AuthForm
            activeForm={activeForm}
            onSubmit={callbacks.onSubmit}
            onChangeForm={callbacks.changeForm}
            errorState={authState.errorState}
          />
        </div>
      )
    );
  }

  return <Navigate to="/" replace />;
}
