import { memo } from "react";
import { Chart } from "react-google-charts";
import { Category } from "../../api/expenses.types";
import { Expense } from "../../store/expenseSlice";

type BarChartData = {
  categories: Category[];
  expenses: Expense[];
};

type Props = {
  data: BarChartData;
};

export const BarChart = memo(({ data }: Props) => {
  if (data.expenses.length === 0) return null;

  const processedData = [
    ...data.categories
      .map((category): [string, number] => {
        const sum = data.expenses.reduce((acc, el) => {
          if (el.categoryId === category.id) return acc + el.amount;
          return acc;
        }, 0);
        return [category.name, sum / 100];
      })
      .filter((e) => e[1] > 0)
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1]),
  ];

  const sdata = [["category", "value"], ...processedData];

  return <Chart chartType="Bar" width="100%" height="400px" data={sdata} />;
});
