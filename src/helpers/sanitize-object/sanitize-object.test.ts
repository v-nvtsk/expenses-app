import { sanitizeObject } from "./sanitize-object";

describe("sanitizeObject", () => {
  it("should clear object from nullable fields", () => {
    const testData = [
      {
        obj: {
          name: "John",
          age: 30,
          address: null,
        },
        expected: {
          name: "John",
          age: 30,
        },
      },
      {
        obj: {
          name: "John",
          surname: "",
          age: 30,
          address: null,
        },
        expected: {
          name: "John",
          age: 30,
        },
      },
    ];

    testData.forEach(({ obj, expected }) => {
      const result = sanitizeObject(obj);
      expect(result).toEqual(expected);
    });
  });
});
