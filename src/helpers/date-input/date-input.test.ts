import {
  getCurrentWeekNumber,
  getFirstDayOfWeekByNumber,
  getWeekNumber,
  timestampToDateInputValue,
} from "./date-input";

describe("parseWeek", () => {
  /* 

  Week string	Week and year (Date range)
  2001-W37	Week 37, 2001 (September 10-16, 2001)
  1953-W01	Week 1, 1953 (December 29, 1952-January 4, 1953)
  1948-W53	Week 53, 1948 (December 27, 1948-January 2, 1949)
  1949-W01	Week 1, 1949 (January 3-9, 1949)

  */
  it("should return first date of week by number", () => {
    expect(getFirstDayOfWeekByNumber("2024-W01")).toBe(new Date(2024, 0, 1).getTime());
    expect(getFirstDayOfWeekByNumber("2023-W01")).toBe(new Date(2023, 0, 2).getTime());
    expect(getFirstDayOfWeekByNumber("2022-W01")).toBe(new Date(2022, 0, 3).getTime());
    expect(getFirstDayOfWeekByNumber("2021-W01")).toBe(new Date(2021, 0, 4).getTime());
    expect(getFirstDayOfWeekByNumber("2020-W01")).toBe(new Date(2019, 11, 30).getTime());
    expect(getFirstDayOfWeekByNumber("2001-W37")).toBe(new Date(2001, 8, 10).getTime());
    expect(getFirstDayOfWeekByNumber("1953-W01")).toBe(new Date(1952, 11, 29).getTime());
    expect(getFirstDayOfWeekByNumber("1948-W53")).toBe(new Date(1948, 11, 27).getTime());
    expect(getFirstDayOfWeekByNumber("1949-W01")).toBe(new Date(1949, 0, 3).getTime());
  });
});

describe("getWeekNumber", () => {
  it("should return week number for date", () => {
    expect(getWeekNumber(new Date(2024, 0, 1).getTime())).toEqual([2024, 1]);
    expect(getWeekNumber(new Date(2023, 0, 2).getTime())).toEqual([2023, 1]);
    expect(getWeekNumber(new Date(2022, 0, 3).getTime())).toEqual([2022, 1]);
    expect(getWeekNumber(new Date(2021, 0, 4).getTime())).toEqual([2021, 1]);
    expect(getWeekNumber(new Date(2019, 11, 30).getTime())).toEqual([2020, 1]);
    expect(getWeekNumber(new Date(2001, 8, 10).getTime())).toEqual([2001, 37]);
    expect(getWeekNumber(new Date(1952, 11, 29).getTime())).toEqual([1953, 1]);
    expect(getWeekNumber(new Date(1948, 11, 27).getTime())).toEqual([1948, 53]);
    expect(getWeekNumber(new Date(1949, 0, 3).getTime())).toEqual([1949, 1]);
  });
});

describe("getCurrentWeekNumber", () => {
  jest.useFakeTimers();

  it("should return current week number", () => {
    jest.setSystemTime(new Date("2024-01-01"));
    expect(getCurrentWeekNumber()).toEqual([2024, 1]);
    jest.setSystemTime(new Date("2023-01-02"));
    expect(getCurrentWeekNumber()).toEqual([2023, 1]);
    jest.setSystemTime(new Date("2022-01-03"));
    expect(getCurrentWeekNumber()).toEqual([2022, 1]);
    jest.setSystemTime(new Date("2021-01-04"));
    expect(getCurrentWeekNumber()).toEqual([2021, 1]);
    jest.setSystemTime(new Date(2019, 11, 30));
    expect(getCurrentWeekNumber()).toEqual([2020, 1]);
    jest.setSystemTime(new Date(2001, 8, 10));
    expect(getCurrentWeekNumber()).toEqual([2001, 37]);
    jest.setSystemTime(new Date(1952, 11, 29));
    expect(getCurrentWeekNumber()).toEqual([1953, 1]);
    jest.setSystemTime(new Date(1948, 11, 27));
    expect(getCurrentWeekNumber()).toEqual([1948, 53]);
    jest.setSystemTime(new Date(1949, 0, 3));
    expect(getCurrentWeekNumber()).toEqual([1949, 1]);
  });
});

describe("timestampToDateInputValue", () => {
  it("should return date input value for timestamp", () => {
    expect(timestampToDateInputValue(new Date(2024, 0, 1).getTime())).toEqual("2024-01-01");
    expect(timestampToDateInputValue(new Date(2023, 0, 2).getTime())).toEqual("2023-01-02");
    expect(timestampToDateInputValue(new Date(2022, 0, 3).getTime())).toEqual("2022-01-03");
    expect(timestampToDateInputValue(new Date(2021, 0, 4).getTime())).toEqual("2021-01-04");
    expect(timestampToDateInputValue(new Date(2019, 11, 30).getTime())).toEqual("2019-12-30");
    expect(timestampToDateInputValue(new Date(2001, 8, 10).getTime())).toEqual("2001-09-10");
    expect(timestampToDateInputValue(new Date(1952, 11, 29).getTime())).toEqual("1952-12-29");
    expect(timestampToDateInputValue(new Date(1948, 11, 27).getTime())).toEqual("1948-12-27");
    expect(timestampToDateInputValue("")).toEqual("");
  });
});
