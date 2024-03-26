import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExpenseState, read as readExpense } from "../../store/expenseSlice";
import { AppDispatch, StoreRootState } from "../../store";
import { createDefaultFilter } from "../filter-form/filter-form";
import { IncomeState, read as readIncome } from "../../store/incomeSlice";
import { formatMoney } from "../../helpers/format-number/format-number";

export const WeeklyStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector<StoreRootState>((state) => state.expenses) as ExpenseState;
  const income = useSelector<StoreRootState>((state) => state.income) as IncomeState;

  useEffect(() => {
    dispatch(readExpense(createDefaultFilter("week")));
    dispatch(readIncome(createDefaultFilter("week")));
  }, []);

  const totalExpenses = expenses.items.reduce((acc, item) => acc + item.amount, 0);
  const totalIncome = income.items.reduce((acc, item) => acc + item.amount, 0);
  return (
    <div>
      <hr className="border-primary" />
      <h2>Weekly stats</h2>
      <p className="text-info">
        Total expenses: <span className="text-primary">{formatMoney(totalExpenses)}</span>
      </p>
      <p className="text-info">
        Total income: <span className="text-primary">{formatMoney(totalIncome)}</span>
      </p>
    </div>
  );
};
