import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppDispatch, StoreRootState } from "../../store";
import { Expense, read as readExpenses } from "../../store/expenseSlice";
import { readAll as readCategories } from "../../store/categorySlice";
import { BarChart } from "../../components/bar-chart";
import { Table } from "../../components/table";
import { FilterForm } from "../../components/filter-form";
import "./style.css";
import { sanitizeObject } from "../../helpers/sanitize-object";
import { createDefaultFilter } from "../../components/filter-form/filter-form";

export type ViewFilter = {
  view: string;
  dateFrom: number | null;
  dateTo: number | null;
};

export const Stats = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const search = Object.fromEntries(new URLSearchParams(searchParams));

  const [filter, setFilter] = useState<ViewFilter>(createDefaultFilter(search?.view || "week"));

  const dispatch = useDispatch<AppDispatch>();
  const expenses = useSelector((state: StoreRootState) => state.expenses).items as Expense[];
  const categories = useSelector((state: StoreRootState) => state.category).items;

  useEffect(() => {
    dispatch(readExpenses(filter));
    dispatch(readCategories({}));
  }, [filter]);

  const callbacks = {
    onFilterChange: ({ view, dateFrom, dateTo }: ViewFilter) => {
      setFilter({ view, dateFrom, dateTo });
      const newSearch = new URLSearchParams(sanitizeObject({ view, dateFrom, dateTo })).toString();
      navigate({ search: newSearch }, { replace: true });
    },
  };

  return (
    <main className="page__expenses">
      <div className="container expenses__wrapper">
        <h1>Stats Page</h1>
        <FilterForm filter={filter} onFilterChange={callbacks.onFilterChange} />
        <div className="expensesStats">
          <h2>Stats</h2>
          <BarChart data={{ categories, expenses }} />
          <h2>Expenses</h2>
          <Table data={{ categories, expenses }} />
        </div>
      </div>
    </main>
  );
};
