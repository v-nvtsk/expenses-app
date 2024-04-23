import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { add } from "../../store/incomeSlice";

export const AddIncome = () => {
  const dispatch = useDispatch<AppDispatch>();

  const callbacks = {
    onSubmit: (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      const form = ev.currentTarget;
      const getElement = (name: string) => form.elements[name as keyof typeof form.elements] as HTMLInputElement;

      const title = getElement("incomeName").value;
      const creationDate = new Date(getElement("incomeDate").value).getTime();
      const amount = Number(getElement("incomeAmount").value) * 100;
      dispatch(add({ id: "", title, creationDate, amount }));
      form.reset();
    },
  };

  return (
    <form className="col-12" onSubmit={callbacks.onSubmit}>
      <fieldset>
        <legend>Add new Income</legend>
        <div>
          <label className="form-label mt-4 mt-sm-1" htmlFor="incomeDate">
            Income date*
          </label>
          <input className="form-control" name="incomeDate" type="date" id="incomeDate" required />
        </div>
        <div>
          <label className="form-label mt-4 mt-sm-1" htmlFor="incomeName">
            Income name*
          </label>
          <input className="form-control" name="incomeName" type="text" id="incomeName" required />
        </div>
        <div>
          <label className="form-label mt-4 mt-sm-1" htmlFor="incomeAmount">
            Income amount*
          </label>
          <input className="form-control" name="incomeAmount" type="number" step="0.01" id="incomeAmount" required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Income
        </button>
      </fieldset>
    </form>
  );
};
