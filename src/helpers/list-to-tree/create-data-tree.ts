import { Category } from "../../api/expenses.types";

export const createDataTree = (list: Partial<Category>[]) => {
  const hashTable = Object.create(null);
  list.forEach((elem) => {
    hashTable[elem.id!] = { ...elem, children: [] };
  });

  const dataTree: Category[] = [];
  list.forEach((elem) => {
    if (elem.parentId) hashTable[elem.parentId].children.push(hashTable[elem.id!]);
    else dataTree.push(hashTable[elem.id!]);
  });
  return dataTree;
};
