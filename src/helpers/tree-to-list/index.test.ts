import { treeToList } from "./index";

describe("treeToList", () => {
  test("test1", () => {
    const tree = [
      {
        id: "2",
        name: "Электроника",
        children: [
          {
            id: "3",
            name: "Телефоны",
            children: [
              {
                id: "4",
                name: "Смартфоны",
                children: [{ id: "5", name: "Аксессуары", children: [] }],
              },
            ],
          },
          { id: "6", name: "Ноутбуки", children: [] },
          { id: "7", name: "Телевизоры", children: [] },
        ],
      },
      {
        id: "8",
        name: "Книги",
        children: [
          { id: "9", name: "Учебники", children: [] },
          { id: "10", name: "Художественная", children: [] },
          {
            id: "11",
            name: "Комиксы",
            children: [{ id: "12", name: "Сюрприз =)", children: [] }],
          },
        ],
      },
    ];

    const result = treeToList(tree);

    result.forEach((item) => expect(item).toEqual(expect.objectContaining({ id: expect.any(String) })));
    expect(result).toMatchObject([
      { id: "2", name: "Электроника", leveledName: "Электроника" },
      { id: "3", name: "Телефоны", leveledName: "- Телефоны" },
      { id: "4", name: "Смартфоны", leveledName: "- - Смартфоны" },
      { id: "5", name: "Аксессуары", leveledName: "- - - Аксессуары" },
      { id: "6", name: "Ноутбуки", leveledName: "- Ноутбуки" },
      { id: "7", name: "Телевизоры", leveledName: "- Телевизоры" },
      { id: "8", name: "Книги", leveledName: "Книги" },
      { id: "9", name: "Учебники", leveledName: "- Учебники" },
      { id: "10", name: "Художественная", leveledName: "- Художественная" },
      { id: "11", name: "Комиксы", leveledName: "- Комиксы" },
      { id: "12", name: "Сюрприз =)", leveledName: "- - Сюрприз =)" },
    ]);
  });
});
