import { createFetchOptions } from "./fetch-options";

describe("createFetchOptions", () => {
  it("should create fetch options", () => {
    const options = createFetchOptions("POST", null, { foo: "bar" });
    expect(options).toEqual({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"foo":"bar"}',
    });
  });
  it("should create GET request options with no args", () => {
    const options = createFetchOptions();
    expect(options).toEqual({
      method: "GET",
    });
  });
  it("should create request with custom headers", () => {
    const options = createFetchOptions("POST", { "Content-Type": "text/plain" }, { foo: "bar" });
    expect(options).toEqual({
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: '{"foo":"bar"}',
    });
  });
});
