import { render, within } from "@testing-library/react";
import { createDefaultFilter } from "./filter-form";
import { FilterMonth } from "./filter-month";

describe("FilterMonth", () => {
  it("should render", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2022, 0, 1).getTime());
    const component = render(
      <FilterMonth
        filter={{
          view: "month",
          dateFrom: null,
          dateTo: null,
        }}
        onChange={() => jest.fn}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by month/i });
    const inputWeek: HTMLInputElement = within(group).getByLabelText(/select month/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    expect(group).toBeInTheDocument();
    expect(inputWeek).toBeInTheDocument();
    expect(inputWeek.value).toEqual("2022-01");
    jest.useRealTimers();
    jest.getRealSystemTime();
    expect(btnSubmit).toBeInTheDocument();
    expect(component.container).toBeInTheDocument();
  });

  it("should submit on button press", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterMonth
        filter={{
          view: "month",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 8).getTime() - 1,
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by month/i });
    const inputWeek: HTMLInputElement = within(group).getByLabelText(/select month/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputWeek.value = "2022-01";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith({
      view: "month",
      dateFrom: new Date(2022, 0, 1).getTime(),
      dateTo: new Date(2022, 1, 1).getTime() - 1,
    });
  });

  it("should submit default filter on clear field", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterMonth
        filter={{
          view: "month",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 8).getTime() - 1,
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by month/i });
    const inputWeek: HTMLInputElement = within(group).getByLabelText(/select month/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputWeek.value = "";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith(createDefaultFilter("month"));
  });
});
