import { render, within } from "@testing-library/react";
import { FilterYear } from "./filter-year";

describe("FilterYear", () => {
  it("should render", () => {
    const component = render(
      <FilterYear
        filter={{
          view: "year",
          dateFrom: new Date(2023, 0).getTime(),
          dateTo: new Date(2024, 0).getTime() - 1,
        }}
        onChange={() => jest.fn}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by year/i });
    const inputYear = within(group).getByRole("spinbutton", { name: /Select year/i });
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    expect(group).toBeInTheDocument();
    expect(inputYear).toBeInTheDocument();
    expect(btnSubmit).toBeInTheDocument();
    expect(component.container).toBeInTheDocument();
  });

  it("should submit on button press", async () => {
    const mockOnChange = jest.fn();
    const component = render(
      <FilterYear
        filter={{
          view: "year",
          dateFrom: new Date(2023, 0).getTime(),
          dateTo: new Date(2024, 0).getTime() - 1,
        }}
        onChange={mockOnChange}
      />,
    );

    const group = within(component.container).getByRole("group", { name: /filter data by year/i });
    const inputYear: HTMLInputElement = within(group).getByRole("spinbutton", { name: /Select year/i });
    const btnSubmit = within(group).getByRole("button", { name: /set filter/i });

    inputYear.value = "2022";

    await btnSubmit.click();
    expect(mockOnChange).toHaveBeenCalledWith({
      view: "year",
      dateFrom: new Date(2022, 0).getTime(),
      dateTo: new Date(2023, 0).getTime() - 1,
    });
  });
});
