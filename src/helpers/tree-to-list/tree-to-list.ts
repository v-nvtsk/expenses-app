import { Category } from "../../api/expenses.types";

const defaultCb = (item: Category, level: number) => ({
  ...item,
  id: item.id,
  leveledName: "- ".repeat(level) + item.name,
});

export function treeToList(tree: {}, callback = defaultCb, level = 0, result: Category[] = []) {
  (Object.values(tree) as Category[]).forEach((item: Category) => {
    result.push(callback ? callback(item, level) : item);
    if (item.children?.length) treeToList(item.children, callback, level + 1, result);
  });
  return result;
}
