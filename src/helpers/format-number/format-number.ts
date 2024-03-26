export function formatMoney(amount: number) {
  const formatter = new Intl.NumberFormat("ru-RU", { style: "decimal" });
  const result = formatter.format(amount / 100);
  return result;
}
