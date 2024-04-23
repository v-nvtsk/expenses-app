import { Category } from "../../api/expenses.types";
import { createDataTree } from "./index";

describe("createDataTree", () => {
  test("test1", () => {
    const list: Partial<Category>[] = [
      { id: "2", name: "Электроника", parentId: "" },
      { id: "3", name: "Телефоны", parentId: "2" },
      { id: "8", name: "Книги", parentId: "" },
      { id: "9", name: "Учебники", parentId: "8" },
      { id: "6", name: "Ноутбуки", parentId: "2" },
      { id: "7", name: "Телевизоры", parentId: "2" },
      { id: "10", name: "Художественная", parentId: "8" },
      { id: "11", name: "Комиксы", parentId: "8" },
      { id: "4", name: "Смартфоны", parentId: "3" },
      { id: "5", name: "Аксессуары", parentId: "3" },
    ];

    expect(createDataTree(list)).toEqual([
      {
        id: "2",
        name: "Электроника",
        parentId: "",
        children: [
          {
            id: "3",
            name: "Телефоны",
            parentId: "2",
            children: [
              { id: "4", name: "Смартфоны", parentId: "3", children: [] },
              { id: "5", name: "Аксессуары", parentId: "3", children: [] },
            ],
          },
          { id: "6", name: "Ноутбуки", parentId: "2", children: [] },
          { id: "7", name: "Телевизоры", parentId: "2", children: [] },
        ],
      },
      {
        id: "8",
        name: "Книги",
        parentId: "",
        children: [
          { id: "9", name: "Учебники", parentId: "8", children: [] },
          { id: "10", name: "Художественная", parentId: "8", children: [] },
          { id: "11", name: "Комиксы", parentId: "8", children: [] },
        ],
      },
    ]);
  });

  test("test2", () => {
    const list = [
      { id: "0", name: "Сюрприз =)", parentId: "11" },
      { id: "2", name: "Электроника", parentId: "" },
      { id: "3", name: "Телефоны", parentId: "2" },
      { id: "8", name: "Книги", parentId: "" },
      { id: "9", name: "Учебники", parentId: "8" },
      { id: "6", name: "Ноутбуки", parentId: "2" },
      { id: "7", name: "Телевизоры", parentId: "2" },
      { id: "10", name: "Художественная", parentId: "8" },
      { id: "11", name: "Комиксы", parentId: "8" },
      { id: "4", name: "Смартфоны", parentId: "3" },
      { id: "5", name: "Аксессуары", parentId: "4" },
    ];

    expect(createDataTree(list)).toEqual([
      {
        id: "2",
        name: "Электроника",
        parentId: "",
        children: [
          {
            id: "3",
            name: "Телефоны",
            parentId: "2",
            children: [
              {
                id: "4",
                name: "Смартфоны",
                parentId: "3",
                children: [{ id: "5", name: "Аксессуары", parentId: "4", children: [] }],
              },
            ],
          },
          { id: "6", name: "Ноутбуки", parentId: "2", children: [] },
          { id: "7", name: "Телевизоры", parentId: "2", children: [] },
        ],
      },
      {
        id: "8",
        name: "Книги",
        parentId: "",
        children: [
          { id: "9", name: "Учебники", parentId: "8", children: [] },
          { id: "10", name: "Художественная", parentId: "8", children: [] },
          {
            id: "11",
            name: "Комиксы",
            parentId: "8",
            children: [{ id: "0", name: "Сюрприз =)", parentId: "11", children: [] }],
          },
        ],
      },
    ]);
  });

  test("test3", () => {
    const list = [
      { id: "3", name: "Телефоны", parentId: "2" },
      { id: "2", name: "Электроника", parentId: "" },
      { id: "9", name: "Учебники", parentId: "8" },
      { id: "8", name: "Книги", parentId: "" },
      { id: "6", name: "Ноутбуки", parentId: "2" },
      { id: "7", name: "Телевизоры", parentId: "2" },
      { id: "10", name: "Художественная", parentId: "8" },
      { id: "11", name: "Комиксы", parentId: "8" },
      { id: "4", name: "Смартфоны", parentId: "3" },
      { id: "5", name: "Аксессуары", parentId: "3" },
    ];

    expect(createDataTree(list)).toEqual([
      {
        id: "2",
        name: "Электроника",
        parentId: "",
        children: [
          {
            id: "3",
            name: "Телефоны",
            parentId: "2",
            children: [
              { id: "4", name: "Смартфоны", parentId: "3", children: [] },
              { id: "5", name: "Аксессуары", parentId: "3", children: [] },
            ],
          },
          { id: "6", name: "Ноутбуки", parentId: "2", children: [] },
          { id: "7", name: "Телевизоры", parentId: "2", children: [] },
        ],
      },
      {
        id: "8",
        name: "Книги",
        parentId: "",
        children: [
          { id: "9", name: "Учебники", parentId: "8", children: [] },
          { id: "10", name: "Художественная", parentId: "8", children: [] },
          { id: "11", name: "Комиксы", parentId: "8", children: [] },
        ],
      },
    ]);
  });
});
