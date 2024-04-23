import { render, within } from "@testing-library/react";
import { createDefaultFilter } from "./filter-form";
import { FilterWeek } from "./filter-week";

describe("FilterWeek", () => {
  it("should render", () => {
    const component = render(
      <FilterWeek
        filter={{
          view: "week",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 8).getTime() - 1,
        }}
        onChange={() => jest.fn}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by week/i });
    const inputWeek = within(group).getByLabelText(/select week/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    expect(group).toBeInTheDocument();
    expect(inputWeek).toBeInTheDocument();
    expect(btnSubmit).toBeInTheDocument();
    expect(component.container).toBeInTheDocument();
  });

  it("should submit on button press", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterWeek
        filter={{
          view: "week",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 8).getTime() - 1,
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by week/i });
    const inputWeek: HTMLInputElement = within(group).getByLabelText(/select week/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputWeek.value = "2022-W01";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith({
      view: "week",
      dateFrom: new Date(2022, 0, 3).getTime(),
      dateTo: new Date(2022, 0, 10).getTime() - 1,
    });
  });

  it("should submit default filter on clear field", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterWeek
        filter={{
          view: "week",
          dateFrom: new Date(2024, 0, 1).getTime(),
          dateTo: new Date(2024, 0, 8).getTime() - 1,
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by week/i });
    const inputWeek: HTMLInputElement = within(group).getByLabelText(/select week/i);
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputWeek.value = "";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith(createDefaultFilter("week"));
  });
});
