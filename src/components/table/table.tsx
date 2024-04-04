import { Category } from "../../api/expenses.types";
import { formatMoney } from "../../helpers/format-number/format-number";
import { Expense } from "../../store/expenseSlice";

type TableData = {
  categories: Category[];
  expenses: Expense[];
};

type TableProps = {
  data: TableData;
};

export const Table = ({ data }: TableProps) =>
  data.expenses.length > 0 && (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>title</th>
          <th>Category</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.expenses.map((item) => (
          <tr key={item.id}>
            <td>
              {new Date(item.creationDate).toLocaleDateString("ru", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </td>
            <td>{item.title}</td>
            <td>{data.categories.find((c) => c.id === item.categoryId)?.name}</td>
            <td>{formatMoney(item.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
