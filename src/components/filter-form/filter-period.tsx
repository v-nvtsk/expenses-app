import React, { useRef } from "react";
import { ViewFilter } from "../../app/stats/stats";
import { timestampToDateInputValue } from "../../helpers/date-input/date-input";

type Props = {
  filter: ViewFilter;
  onChange: (filter: ViewFilter) => void;
};

export const FilterPeriod = ({ filter, onChange }: Props) => {
  const { dateFrom, dateTo } = filter;

  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const subForm = useRef<HTMLFieldSetElement>(null);

  const callbacks = {
    onSubmit: (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      if (subForm.current!.validity.valid) {
        const newFilter = { ...filter };

        newFilter.dateFrom = new Date(fromRef.current!.value).getTime() || null;
        newFilter.dateTo = new Date(toRef.current!.value).getTime() || null;

        if (newFilter.dateFrom && newFilter.dateTo && newFilter.dateFrom > newFilter.dateTo) {
          const temp = newFilter.dateFrom;
          newFilter.dateFrom = newFilter.dateTo;
          newFilter.dateTo = temp;

          fromRef.current!.value = timestampToDateInputValue(newFilter.dateFrom);
          toRef.current!.value = timestampToDateInputValue(newFilter.dateTo);
        }
        onChange(newFilter);
      }
    },
  };

  return (
    <fieldset ref={subForm} className="p-2">
      <legend>Filter data by date</legend>
      <div className="row justify-content-start d-flex flex-column flex-sm-row gap-1">
        <div className="col-5">
          <label className="col-12 col-form-label" htmlFor="dateFrom">
            From date
          </label>
          <input
            ref={fromRef}
            type="date"
            name="dateFrom"
            id="dateFrom"
            defaultValue={timestampToDateInputValue(dateFrom)}
          />
        </div>
        <div className="col-5">
          <label className="col-12 col-form-label" htmlFor="dateTo">
            To date
          </label>
          <input ref={toRef} type="date" name="dateTo" id="dateTo" defaultValue={timestampToDateInputValue(dateTo)} />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3" onClick={callbacks.onSubmit}>
        Set filter
      </button>
    </fieldset>
  );
};
