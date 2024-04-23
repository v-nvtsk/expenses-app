import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreRootState } from "../../store";
import { CategoryState, readAll } from "../../store/categorySlice";
import { add } from "../../store/expenseSlice";

export const AddExpenses = memo(() => {
  const categoryState = useSelector<StoreRootState>((state) => state.category) as CategoryState;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(readAll({}));
  }, []);

  const callbacks = {
    onSubmit: (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      const form = ev.currentTarget;
      const getElement = (name: string) => form.elements[name as keyof typeof form.elements] as HTMLInputElement;

      const title = getElement("expenseName").value;
      const categoryId = getElement("expenseCategory").value;
      const creationDate = new Date(getElement("expenseDate").value).getTime();
      const amount = Number(getElement("expenseAmount").value) * 100;
      dispatch(add({ id: "", title, categoryId, creationDate, amount }));
      form.reset();
    },
  };

  return (
    <form className="col-12" onSubmit={callbacks.onSubmit}>
      <fieldset>
        <legend>Add new Expense</legend>
        <div>
          <label className="form-label mt-4 mt-sm-1" htmlFor="expenseDate">
            Expense date*
          </label>
          <input className="form-control" name="expenseDate" type="date" id="expenseDate" required />
        </div>
        <div>
          <label className="form-label mt-4 mt-sm-1" htmlFor="expenseName">
            Expense name*
          </label>
          <input className="form-control" name="expenseName" type="text" id="expenseName" required />
        </div>
        <div>
          <label className="form-label mt-4 mt-sm-1" htmlFor="expenseAmount">
            Expense amount*
          </label>
          <input className="form-control" name="expenseAmount" type="number" step="0.01" id="expenseAmount" required />
        </div>
        <div>
          <label htmlFor="expenseCategory" className="form-label mt-4 mt-sm-1">
            Select category*
          </label>
          <select className="form-select" id="expenseCategory" size={10} required defaultValue="">
            <option value="global"></option>
            {categoryState.items.map((category) => (
              <option key={category.id} value={category.id}>
                {category.leveledName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Expense
        </button>
      </fieldset>
    </form>
  );
});
