export function calculateHouseholdBudget(values: Record<string, number | string>) {
  const income = Number(values.income) || 0;
  const rent = Number(values.rent) || 0;
  const food = Number(values.food) || 0;
  const utilities = Number(values.utilities) || 0;
  const communication = Number(values.communication) || 0;
  const transport = Number(values.transport) || 0;
  const insurance = Number(values.insurance) || 0;
  const other = Number(values.other) || 0;

  const totalExpense = rent + food + utilities + communication + transport + insurance + other;
  const savings = Math.max(0, income - totalExpense);
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const rentRate = income > 0 ? (rent / income) * 100 : 0;
  const foodRate = income > 0 ? (food / income) * 100 : 0;

  const adviceItems: string[] = [];
  if (rentRate > 30) adviceItems.push(`住居費が収入の${rentRate.toFixed(0)}%（推奨30%以内）`);
  if (foodRate > 15) adviceItems.push(`食費が収入の${foodRate.toFixed(0)}%（推奨15%以内）`);
  if (communication > income * 0.05) adviceItems.push("通信費が収入の5%超（格安SIM検討を）");
  if (savingsRate < 10) adviceItems.push("貯蓄率が10%未満（固定費の見直しを検討）");
  if (adviceItems.length === 0) adviceItems.push("バランスが取れています！このまま継続しましょう");

  const fmt = (n: number) => n.toLocaleString("ja-JP");

  return {
    totalExpense: fmt(totalExpense),
    savings: fmt(savings),
    savingsRate: savingsRate.toFixed(1),
    rentRate: rentRate.toFixed(1),
    foodRate: foodRate.toFixed(1),
    advice: adviceItems.join(" / "),
  };
}
