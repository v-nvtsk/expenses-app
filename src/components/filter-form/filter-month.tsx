import React, { useRef } from "react";
import { ViewFilter } from "../../app/stats/stats";
import { timestampToDateInputValue } from "../../helpers/date-input/date-input";

type Props = {
  filter: ViewFilter;
  onChange: (filter: ViewFilter) => void;
};

export const FilterMonth = ({ filter, onChange }: Props) => {
  let value = timestampToDateInputValue(new Date().getTime()).slice(0, 7);
  if (filter.dateFrom) {
    value = timestampToDateInputValue(filter.dateFrom).slice(0, 7);
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const callbacks = {
    onChange: (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const target = inputRef.current!;

      if (target.value === "") target.value = timestampToDateInputValue(new Date().getTime()).slice(0, 7);
      const [year, month] = target.value.split("-").map(Number);
      const dateFrom = new Date(year, month - 1).getTime();
      const dateTo = new Date(year, month).getTime() - 1;
      onChange({ view: filter.view, dateFrom, dateTo });
    },
  };

  return (
    <fieldset className="p-2">
      <legend>Filter data by month</legend>
      <div className="">
        <label className="col col-form-label" htmlFor="dateFrom">
          Select month
        </label>
        <div className="col">
          <input ref={inputRef} type="month" defaultValue={value} name="dateFrom" id="dateFrom" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3" onClick={callbacks.onChange}>
        Set filter
      </button>
    </fieldset>
  );
};
