import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const Select = ({ value, onChange }: Props) => {
  const callbacks = {
    onChange: (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const { target } = ev;
      onChange(target.value);
    },
  };
  return (
    <fieldset className="p-2 col-6">
      <legend>Select filter...</legend>
      <select
        className="form-select border border-1 border-primary"
        id="selectFilterView"
        onChange={callbacks.onChange}
        value={value}
      >
        <option value="period">Select period</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    </fieldset>
  );
};
