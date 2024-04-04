import { act, render } from "@testing-library/react";
import { BarChart } from "./bar-chart";

const MockChart = jest.fn();

jest.mock("react-google-charts", () => ({
  Chart: (props: any) => MockChart(props),
}));

describe("BarChart", () => {
  it("should not render if no data", async () => {
    const component = await act(async () => render(<BarChart data={{ categories: [], expenses: [] }} />));
    expect(component.container).toBeInTheDocument();
    expect(component.container.innerHTML).toEqual("");
  });

  it("should render if data present", () => {
    const categories = [
      {
        id: "111",
        name: "cat1",
        parentId: "",
      },
      {
        id: "222",
        name: "cat2",
        parentId: "",
      },
      {
        id: "333",
        name: "cat3",
        parentId: "",
      },
    ];
    const expenses = [
      {
        creationDate: new Date().getTime(),
        id: "item_id-1",
        title: "title",
        categoryId: "111",
        amount: 10000,
      },
      {
        creationDate: new Date().getTime(),
        id: "item_id-2",
        title: "title",
        categoryId: "222",
        amount: 20000,
      },
      {
        creationDate: new Date().getTime(),
        id: "item_id-3",
        title: "title",
        categoryId: "333",
        amount: 30000,
      },
    ];

    const chartData = [
      ["category", "value"],
      ["cat3", 300],
      ["cat2", 200],
      ["cat1", 100],
    ];

    const component = render(<BarChart data={{ categories, expenses }} />);
    expect(component.container).toBeInTheDocument();
    expect(MockChart).toHaveBeenCalledWith({
      chartType: "Bar",
      width: "100%",
      height: "400px",
      data: chartData,
    });
  });
});
