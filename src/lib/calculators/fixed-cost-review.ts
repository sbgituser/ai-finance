export function calculateFixedCostReview(values: Record<string, number | string>) {
  const mobilePhone = Number(values.mobilePhone) || 0;
  const electricity = Number(values.electricity) || 0;
  const gas = Number(values.gas) || 0;
  const internet = Number(values.internet) || 0;
  const subscription = Number(values.subscription) || 0;

  const newMobile = Number(values.newMobile) || 0;
  const newElectricity = Number(values.newElectricity) || 0;
  const newSubscription = Number(values.newSubscription) || 0;

  const currentMonthly = mobilePhone + electricity + gas + internet + subscription;
  // Gas and internet are assumed unchanged (user only inputs mobile, electricity, subscription changes)
  const newMonthly = newMobile + newElectricity + gas + internet + newSubscription;

  const monthlyReduction = Math.max(0, currentMonthly - newMonthly);
  const annualSavings = monthlyReduction * 12;
  const tenYearSavings = annualSavings * 10;

  const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");

  return {
    currentMonthly: fmt(currentMonthly),
    newMonthly: fmt(newMonthly),
    monthlyReduction: fmt(monthlyReduction),
    annualSavings: fmt(annualSavings),
    tenYearSavings: fmt(tenYearSavings),
  };
}
