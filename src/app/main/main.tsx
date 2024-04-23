import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AddExpenses } from "../../components/add-expenses";
import { AddIncome } from "../../components/add-income";
import { WeeklyStats } from "../../components/weekly-stats/weekly-stats";
import { StoreRootState } from "../../store";
import { AuthState } from "../../store/authSlice";
import "./style.css";

export function Main() {
  const authState = useSelector<StoreRootState>((state) => state.auth) as AuthState;
  const { isAuthenticated } = authState;

  return (
    <main className="page__home">
      <div className="container">
        <h1>Expenses App</h1>
        {!isAuthenticated && (
          <div className="unsigned">
            <div className="home__unauthorized">
              <h2 className="text-bg-warning display-5">You are not authorized</h2>
              <p className="mt-4 fs-3">
                Please <Link to="/auth/signin">Sign In</Link> if you are already registered.
              </p>
              <p className="fs-3">
                If you are not registered - you can create new account. <br /> Just{" "}
                <Link to="/auth/signin">Sign Up</Link>!
              </p>
              <p className="mt-6 fs-5">
                After authentication you will be able to add expenses by categories and income and look at statistics
              </p>
              <p style={{ userSelect: "none" }}>
                You can use test account with login: test@test.test and password:1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣
              </p>
            </div>
          </div>
        )}
        {isAuthenticated && (
          <div className="home__wrapper">
            <>
              <AddExpenses />
              <AddIncome />
              <WeeklyStats />
            </>
          </div>
        )}
      </div>
    </main>
  );
}
