import { ViewFilter } from "../../app/stats/stats";
import { DAY_MS } from "../../helpers/date-input/date-input";
import { Select } from "../select/select";
import { FilterMonth } from "./filter-month";
import { FilterPeriod } from "./filter-period";
import { FilterWeek } from "./filter-week";
import { FilterYear } from "./filter-year";

type Props = {
  filter: ViewFilter;
  onFilterChange: ({ dateFrom, dateTo }: ViewFilter) => void;
};

export function createDefaultFilter(value: string) {
  const newFilter: ViewFilter = {
    view: value,
    dateFrom: null,
    dateTo: null,
  };

  if (value === "period") {
    newFilter.dateFrom = new Date().setHours(0, 0, 0, 0);
    newFilter.dateTo = newFilter.dateFrom + DAY_MS - 1;
  }
  if (value === "week") {
    const date = new Date();
    date.setDate(date.getDate() - (date.getDay() || 7) + 1);
    date.setHours(0, 0, 0, 0);
    newFilter.dateFrom = date.getTime();
    newFilter.dateTo = newFilter.dateFrom + 7 * DAY_MS - 1;
  }
  if (value === "month") {
    const date = new Date();
    newFilter.dateFrom = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    newFilter.dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - 1;
  }
  if (value === "year") {
    const date = new Date();
    newFilter.dateFrom = new Date(date.getFullYear(), 0, 1).getTime();
    newFilter.dateTo = new Date(date.getFullYear() + 1, 0, 1).getTime() - 1;
  }
  return newFilter;
}

export const FilterForm = ({ filter, onFilterChange }: Props) => {
  const { view } = filter;

  const callbacks = {
    onChange: (newFilter: ViewFilter) => {
      onFilterChange({ ...newFilter });
    },
    onViewChange: (newView: string) => {
      const newFilter = createDefaultFilter(newView);
      onFilterChange(newFilter);
    },
  };

  return (
    <form className=" d-flex flex-column col-12 col-md-6">
      <Select value={view} onChange={callbacks.onViewChange} />
      {view === "period" && <FilterPeriod filter={filter} onChange={callbacks.onChange} />}
      {view === "week" && <FilterWeek filter={filter} onChange={callbacks.onChange} />}
      {view === "month" && <FilterMonth filter={filter} onChange={callbacks.onChange} />}
      {view === "year" && <FilterYear filter={filter} onChange={callbacks.onChange} />}
    </form>
  );
};
