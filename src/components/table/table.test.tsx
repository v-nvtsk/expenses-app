import { render } from "@testing-library/react";
import { Table } from "./table";

describe("Table", () => {
  const categoryData = {
    id: "test_id-1",
    name: "test",
    parentId: "",
    leveledName: "test",
    children: [],
  };
  const testData = {
    id: "",
    title: "test expense",
    amount: 300 * 100,
    categoryId: categoryData.id,
    creationDate: new Date("2024-01-01").getTime(),
  };

  it("should render", () => {
    const component = render(<Table data={{ categories: [categoryData], expenses: [testData] }} />);

    expect(component.container).toBeInTheDocument();
  });
});
