export const DAY_MS = 3600 * 24 * 1000;

export function timestampToDateInputValue(value: number | null | undefined | ""): string {
  if (!value) {
    return "";
  }
  const d = new Date(value);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const date = d.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${date}`;
}

export function getFirstDayOfWeekByNumber(value: string): number {
  const [year, week] = value.split("-W").map(Number);
  const date = new Date(year, 0, 1);
  let diff = 0;
  if ((date.getDay() || 7) <= 4) diff = 1 - date.getDay();
  else diff = 7 + 1 - (date.getDay() || 7);
  date.setDate(1 + diff + (week - 1) * 7);
  return date.getTime();
}

export function getWeekNumber(timestamp: number): [number, number] {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);

  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
  return [date.getFullYear(), weekNo];
}

export function getCurrentWeekNumber() {
  return getWeekNumber(new Date().getTime());
}
