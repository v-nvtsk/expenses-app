import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BarChart } from "../../components/bar-chart";
import { FilterForm } from "../../components/filter-form";
import { createDefaultFilter } from "../../components/filter-form/filter-form";
import { Table } from "../../components/table";
import { sanitizeObject } from "../../helpers/sanitize-object";
import { AppDispatch, StoreRootState } from "../../store";
import { readAll as readCategories } from "../../store/categorySlice";
import { Expense, read as readExpenses } from "../../store/expenseSlice";
import "./style.css";

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
