import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AuthState, authSlice } from "./authSlice";
import { categorySlice, CategoryState } from "./categorySlice";
import { expenseSlice, ExpenseState } from "./expenseSlice";
import { incomeSlice, IncomeState } from "./incomeSlice";

export type StoreRootState = {
  auth: AuthState;
  category: CategoryState;
  expenses: ExpenseState;
  income: IncomeState;
};

const appReducer = combineReducers({
  auth: authSlice.reducer,
  category: categorySlice.reducer,
  expenses: expenseSlice.reducer,
  income: incomeSlice.reducer,
});

const reducerProxy = (state: any, action: { type: string; payload: any }) => {
  if (action.type === "logout/LOGOUT") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const Store = configureStore({
  reducer: reducerProxy,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof Store.dispatch;
