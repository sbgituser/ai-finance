// 協会けんぽ 都道府県別保険料率（2025年度、労使折半の本人負担分）
const prefectureHealthRate: Record<string, number> = {
  "東京都": 0.04990,
  "神奈川県": 0.05010,
  "大阪府": 0.05145,
  "愛知県": 0.04945,
  "埼玉県": 0.04900,
  "その他": 0.05000,
};

export function calculateTakeHomePay(values: Record<string, number | string>) {
  const annualIncome = Number(values.annualIncome) || 0;
  const dependents = Number(String(values.dependents).replace("人", "").replace("以上", "")) || 0;
  const ageGroup = String(values.ageGroup);
  const prefecture = String(values.prefecture);

  if (annualIncome <= 0) {
    return {
      monthlyTakeHome: "0",
      healthInsurance: "0",
      pension: "0",
      employmentInsurance: "0",
      incomeTax: "0",
      residentTax: "0",
      effectiveRate: "0",
    };
  }

  const monthlySalary = annualIncome / 12;

  // 社会保険料（月額）
  const healthRate = prefectureHealthRate[prefecture] ?? 0.05000;
  const pensionRate = 0.0915; // 厚生年金 9.15%（本人負担）
  const employmentRate = 0.006; // 雇用保険 0.6%
  const nursingRate = ageGroup === "40〜64歳" ? 0.00910 : 0; // 介護保険

  const monthlyHealth = monthlySalary * healthRate;
  // 標準報酬月額上限 65万円（厚生年金）
  const cappedMonthlySalary = Math.min(monthlySalary, 650_000);
  const monthlyPension = cappedMonthlySalary * pensionRate;
  const monthlyEmployment = monthlySalary * employmentRate;
  const monthlyNursing = monthlySalary * nursingRate;
  const monthlySocialInsurance =
    monthlyHealth + monthlyPension + monthlyEmployment + monthlyNursing;
  const annualSocialInsurance = monthlySocialInsurance * 12;

  // 給与所得控除
  let employmentDeduction: number;
  if (annualIncome <= 1_800_000) {
    employmentDeduction = Math.max(annualIncome * 0.4, 550_000);
  } else if (annualIncome <= 3_600_000) {
    employmentDeduction = annualIncome * 0.3 + 80_000;
  } else if (annualIncome <= 6_600_000) {
    employmentDeduction = annualIncome * 0.2 + 440_000;
  } else if (annualIncome <= 8_500_000) {
    employmentDeduction = annualIncome * 0.1 + 1_100_000;
  } else {
    employmentDeduction = 1_950_000;
  }

  // 所得税：課税所得
  const basicDeduction = 480_000;
  const dependentDeduction = dependents * 380_000;
  const taxableIncome = Math.max(
    0,
    annualIncome - employmentDeduction - basicDeduction - annualSocialInsurance - dependentDeduction
  );

  // 所得税率（超過累進）
  let incomeTaxAnnual: number;
  if (taxableIncome <= 1_950_000) {
    incomeTaxAnnual = taxableIncome * 0.05;
  } else if (taxableIncome <= 3_300_000) {
    incomeTaxAnnual = taxableIncome * 0.10 - 97_500;
  } else if (taxableIncome <= 6_950_000) {
    incomeTaxAnnual = taxableIncome * 0.20 - 427_500;
  } else if (taxableIncome <= 9_000_000) {
    incomeTaxAnnual = taxableIncome * 0.23 - 636_000;
  } else if (taxableIncome <= 18_000_000) {
    incomeTaxAnnual = taxableIncome * 0.33 - 1_536_000;
  } else if (taxableIncome <= 40_000_000) {
    incomeTaxAnnual = taxableIncome * 0.40 - 2_796_000;
  } else {
    incomeTaxAnnual = taxableIncome * 0.45 - 4_796_000;
  }
  incomeTaxAnnual = Math.max(0, incomeTaxAnnual) * 1.021; // 復興特別所得税

  // 住民税：課税所得（控除額が所得税とやや異なる）
  let residentEmploymentDeduction: number;
  if (annualIncome <= 1_800_000) {
    residentEmploymentDeduction = Math.max(annualIncome * 0.4, 650_000);
  } else if (annualIncome <= 3_600_000) {
    residentEmploymentDeduction = annualIncome * 0.3 + 80_000;
  } else if (annualIncome <= 6_600_000) {
    residentEmploymentDeduction = annualIncome * 0.2 + 440_000;
  } else if (annualIncome <= 8_500_000) {
    residentEmploymentDeduction = annualIncome * 0.1 + 1_100_000;
  } else {
    residentEmploymentDeduction = 1_950_000;
  }
  const residentBasicDeduction = 430_000;
  const residentDependentDeduction = dependents * 330_000;
  const residentTaxableIncome = Math.max(
    0,
    annualIncome -
      residentEmploymentDeduction -
      residentBasicDeduction -
      annualSocialInsurance -
      residentDependentDeduction
  );
  const residentTaxAnnual = Math.max(5_000, residentTaxableIncome * 0.10);

  // 手取り計算
  const totalDeductions = incomeTaxAnnual + residentTaxAnnual + annualSocialInsurance;
  const annualTakeHome = annualIncome - totalDeductions;
  const monthlyTakeHome = annualTakeHome / 12;
  const effectiveRate = (totalDeductions / annualIncome) * 100;

  const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");

  return {
    monthlyTakeHome: fmt(monthlyTakeHome),
    healthInsurance: fmt(monthlyHealth + monthlyNursing),
    pension: fmt(monthlyPension),
    employmentInsurance: fmt(monthlyEmployment),
    incomeTax: fmt(incomeTaxAnnual / 12),
    residentTax: fmt(residentTaxAnnual / 12),
    effectiveRate: effectiveRate.toFixed(1),
  };
}
