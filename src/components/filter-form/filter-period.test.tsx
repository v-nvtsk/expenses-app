import { render, within } from "@testing-library/react";
import { FilterPeriod } from "./filter-period";

describe("FilterWeek", () => {
  it("should render", () => {
    const component = render(
      <FilterPeriod
        filter={{
          view: "period",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 1).getTime() - 1,
        }}
        onChange={() => jest.fn}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by date/i });
    const inputDateFrom = within(group).getByLabelText(/from date/i);
    const inputDateTo = within(group).getByLabelText(/to date/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    expect(group).toBeInTheDocument();
    expect(inputDateFrom).toBeInTheDocument();
    expect(inputDateTo).toBeInTheDocument();
    expect(btnSubmit).toBeInTheDocument();
    expect(component.container).toBeInTheDocument();
  });

  it("should submit on button press", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterPeriod
        filter={{
          view: "period",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 1).getTime(),
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by date/i });
    const inputDateFrom: HTMLInputElement = within(group).getByLabelText(/from date/i);
    const inputDateTo: HTMLInputElement = within(group).getByLabelText(/to date/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputDateFrom.value = "2022-01-01";
    inputDateTo.value = "2022-01-10";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith({
      view: "period",
      dateFrom: new Date("2022-01-01").getTime(),
      dateTo: new Date("2022-01-10").getTime(),
    });
  });

  it("should submit default filter on clear field", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterPeriod
        filter={{
          view: "period",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 1).getTime(),
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by date/i });
    const inputDateFrom: HTMLInputElement = within(group).getByLabelText(/from date/i);
    const inputDateTo: HTMLInputElement = within(group).getByLabelText(/to date/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputDateFrom.value = "";
    inputDateTo.value = "";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith({
      view: "period",
      dateFrom: null,
      dateTo: null,
    });
  });

  it("should swap dateFrom and dateTo if dateFrom > dateTo", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterPeriod
        filter={{
          view: "period",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 1).getTime(),
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by date/i });
    const inputDateFrom: HTMLInputElement = within(group).getByLabelText(/from date/i);
    const inputDateTo: HTMLInputElement = within(group).getByLabelText(/to date/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputDateFrom.value = "2022-01-10";
    inputDateTo.value = "2022-01-01";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith({
      view: "period",
      dateFrom: new Date("2022-01-01").getTime(),
      dateTo: new Date("2022-01-10").getTime(),
    });
  });
});
