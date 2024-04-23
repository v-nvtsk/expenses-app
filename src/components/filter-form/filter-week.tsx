import React, { useRef } from "react";
import { ViewFilter } from "../../app/stats/stats";
import {
  DAY_MS,
  getCurrentWeekNumber,
  getFirstDayOfWeekByNumber,
  getWeekNumber,
} from "../../helpers/date-input/date-input";
import { createDefaultFilter } from "./filter-form";

type Props = {
  filter: ViewFilter;
  onChange: (filter: ViewFilter) => void;
};

export const FilterWeek = ({ filter, onChange }: Props) => {
  let value = getCurrentWeekNumber().join("-W");
  if (filter.dateFrom) {
    const [year, week] = getWeekNumber(filter.dateFrom);
    value = `${year}-W${String(week).padStart(2, "0")}`;
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const callbacks = {
    onSubmit: (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const target = inputRef.current!;
      if (target.value === "") {
        onChange(createDefaultFilter("week"));
      } else {
        const dateFrom = getFirstDayOfWeekByNumber(target.value);
        const dateTo = getFirstDayOfWeekByNumber(target.value) + 7 * DAY_MS - 1;
        onChange({ view: filter.view, dateFrom, dateTo });
      }
    },
  };

  return (
    <fieldset className="p-2">
      <legend>Filter data by week</legend>
      <div className="">
        <label className="col col-form-label" htmlFor="dateFrom">
          Select week
        </label>
        <div className="col">
          <input ref={inputRef} type="week" defaultValue={value} name="dateFrom" id="dateFrom" />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3" onClick={callbacks.onSubmit}>
        Set filter
      </button>
    </fieldset>
  );
};
