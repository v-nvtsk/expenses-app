import React, { useRef } from "react";
import { ViewFilter } from "../../app/stats/stats";

type Props = {
  filter: ViewFilter;
  onChange: (filter: ViewFilter) => void;
};

export const FilterYear = ({ filter, onChange }: Props) => {
  let value = String(new Date().getFullYear());
  if (filter.dateFrom) value = String(new Date(filter.dateFrom).getFullYear());

  const inputRef = useRef<HTMLInputElement>(null);

  const callbacks = {
    onChange: (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const target = inputRef.current!;

      const year = Number(target.value);
      const dateFrom = new Date(year, 0).getTime();
      const dateTo = new Date(year + 1, 0).getTime() - 1;
      onChange({ view: filter.view, dateFrom, dateTo });
    },
  };

  return (
    <fieldset className="p-2">
      <legend>Filter data by year</legend>
      <div className="">
        <label className="col col-form-label" htmlFor="dateFrom">
          Select year
        </label>
        <div className="col">
          <input ref={inputRef} type="number" defaultValue={value} name="dateFrom" id="dateFrom" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3" onClick={callbacks.onChange}>
        Set filter
      </button>
    </fieldset>
  );
};
