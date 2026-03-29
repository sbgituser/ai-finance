export function calculateMortgage(values: Record<string, number | string>) {
  const borrowAmount = Number(values.borrowAmount) || 0;
  const interestRate = Number(values.interestRate) || 0;
  const years = Math.min(Math.max(Number(values.years) || 35, 1), 50);
  const bonusPayment = Number(values.bonusPayment) || 0;

  if (borrowAmount <= 0) {
    return {
      monthlyPayment: "0",
      totalPayment: "0",
      totalInterest: "0",
      interestRatio: "0",
      prepaymentInfo: "借入額を入力してください",
    };
  }

  const months = years * 12;
  const monthlyRate = interestRate / 100 / 12;

  // Monthly payment (元利均等返済方式)
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = borrowAmount / months;
  } else {
    monthlyPayment =
      (borrowAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  }

  // Bonus payments: twice a year
  const totalPayment = monthlyPayment * months + bonusPayment * 2 * years;
  const totalInterest = Math.max(0, totalPayment - borrowAmount);
  const interestRatio = borrowAmount > 0 ? (totalInterest / borrowAmount) * 100 : 0;

  // Prepayment simulation: 1,000,000 yen extra at year 5
  let prepaymentInfo = "—";
  if (years > 5 && monthlyRate > 0 && borrowAmount > 0) {
    const months5 = 60;
    const balanceAt5 =
      borrowAmount * Math.pow(1 + monthlyRate, months5) -
      (monthlyPayment * (Math.pow(1 + monthlyRate, months5) - 1)) / monthlyRate;
    const prepaymentAmount = 1_000_000;
    if (balanceAt5 > prepaymentAmount) {
      const newBalance = balanceAt5 - prepaymentAmount;
      const remainingMonths = months - months5;
      const newMonthlyPayment =
        (newBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
        (Math.pow(1 + monthlyRate, remainingMonths) - 1);
      const normalRemaining = monthlyPayment * remainingMonths;
      const newRemaining = newMonthlyPayment * remainingMonths;
      const interestSaving = Math.round(normalRemaining - newRemaining - prepaymentAmount);
      if (interestSaving > 0) {
        prepaymentInfo = `5年後に100万円繰上返済すると利息が約${interestSaving.toLocaleString("ja-JP")}円削減`;
      }
    }
  }

  const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");

  return {
    monthlyPayment: fmt(monthlyPayment),
    totalPayment: fmt(totalPayment),
    totalInterest: fmt(totalInterest),
    interestRatio: interestRatio.toFixed(1),
    prepaymentInfo,
  };
}
