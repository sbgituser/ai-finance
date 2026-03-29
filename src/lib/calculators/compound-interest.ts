export function calculateCompoundInterest(values: Record<string, number | string>) {
  const initialAmount = Number(values.initialAmount) || 0;
  const monthlyAmount = Number(values.monthlyAmount) || 0;
  const annualRate = Number(values.annualRate) || 0;
  const years = Math.min(Math.max(Number(values.years) || 0, 1), 50);

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  // Future value of initial lump sum
  const fvLump = initialAmount * Math.pow(1 + monthlyRate, months);

  // Future value of monthly annuity
  const fvMonthly =
    monthlyRate > 0
      ? monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : monthlyAmount * months;

  const finalAmount = fvLump + fvMonthly;
  const principal = initialAmount + monthlyAmount * months;
  const profit = finalAmount - principal;
  const profitRate = principal > 0 ? (profit / principal) * 100 : 0;

  // Rule of 72
  const doubleYears = annualRate > 0 ? (72 / annualRate).toFixed(1) : "—";

  const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");

  return {
    finalAmount: fmt(finalAmount),
    principal: fmt(principal),
    profit: fmt(profit),
    profitRate: profitRate.toFixed(1),
    doubleYears: doubleYears.toString(),
  };
}
