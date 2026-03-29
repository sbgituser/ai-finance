"use client";

import { useState, useCallback } from "react";
import { trackToolUse } from "@/lib/analytics";
import { calculateHouseholdBudget } from "@/lib/calculators/household-budget";
import { calculateCompoundInterest } from "@/lib/calculators/compound-interest";
import { calculateLifePlan } from "@/lib/calculators/life-plan";
import { calculateFixedCostReview } from "@/lib/calculators/fixed-cost-review";
import { calculateMortgage } from "@/lib/calculators/mortgage-calculator";
import { calculateTakeHomePay } from "@/lib/calculators/take-home-pay-calculator";

const calculators: Record<string, (values: Record<string, number | string>) => Record<string, string | number>> = {
  "household-budget": calculateHouseholdBudget,
  "compound-interest": calculateCompoundInterest,
  "life-plan": calculateLifePlan,
  "fixed-cost-review": calculateFixedCostReview,
  "mortgage-calculator": calculateMortgage,
  "take-home-pay-calculator": calculateTakeHomePay,
};

interface ToolInput {
  id: string;
  label: string;
  type: "number" | "select";
  unit?: string;
  default: number | string;
  options?: string[];
}

interface ToolOutput {
  id: string;
  label: string;
  unit?: string;
}

interface CalculatorProps {
  slug: string;
  inputs: ToolInput[];
  outputs: ToolOutput[];
}

// Bar chart for household-budget: show expense breakdown as percentage bars
function ExpenseBreakdown({ values }: { values: Record<string, number | string> }) {
  const income = Number(values.income) || 1;
  const items = [
    { label: "家賃・住宅", key: "rent", color: "#059669" },
    { label: "食費", key: "food", color: "#10B981" },
    { label: "光熱費", key: "utilities", color: "#34D399" },
    { label: "通信費", key: "communication", color: "#6EE7B7" },
    { label: "交通費", key: "transport", color: "#A7F3D0" },
    { label: "保険料", key: "insurance", color: "#D1FAE5" },
    { label: "その他", key: "other", color: "#ECFDF5" },
  ];

  return (
    <div className="mt-4 mb-2">
      <h3 className="font-bold text-gray-700 text-sm mb-3">支出内訳（収入比）</h3>
      <div className="space-y-2">
        {items.map((item) => {
          const amount = Number(values[item.key]) || 0;
          const pct = Math.min(100, (amount / income) * 100);
          return (
            <div key={item.key}>
              <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                <span>{item.label}</span>
                <span>{amount.toLocaleString("ja-JP")}円 ({pct.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: item.color, border: "1px solid #059669" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calculator({ slug, inputs, outputs }: CalculatorProps) {
  const initialValues = Object.fromEntries(inputs.map((i) => [i.id, i.default]));
  const [values, setValues] = useState<Record<string, number | string>>(initialValues);

  const calculate = calculators[slug];

  const handleChange = useCallback(
    (id: string, value: string) => {
      const input = inputs.find((i) => i.id === id);
      const parsed = input?.type === "number" ? parseFloat(value) || 0 : value;
      const newValues = { ...values, [id]: parsed };
      setValues(newValues);
      trackToolUse(slug, newValues);
    },
    [values, inputs, slug]
  );

  if (!calculate) {
    return <p className="text-gray-500">このツールの計算ロジックは未実装です。</p>;
  }

  const results = calculate(values);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="space-y-4 mb-6">
        {inputs.map((input) => (
          <div key={input.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {input.label}
              {input.unit && <span className="text-gray-400 ml-1">（{input.unit}）</span>}
            </label>
            {input.type === "select" ? (
              <select
                value={values[input.id] as string}
                onChange={(e) => handleChange(input.id, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {input.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={values[input.id] as number}
                onChange={(e) => handleChange(input.id, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            )}
          </div>
        ))}
      </div>

      {slug === "household-budget" && <ExpenseBreakdown values={values} />}

      <div className="bg-[var(--color-bg)] rounded-lg p-4 space-y-3">
        <h3 className="font-bold text-gray-700 text-sm">計算結果</h3>
        {outputs.map((output) => {
          const isText = output.id === "advice" || output.id === "prepaymentInfo";
          return (
            <div key={output.id} className={`flex justify-between items-start gap-2 ${isText ? "flex-col" : ""}`}>
              <span className="text-gray-600 text-sm shrink-0">{output.label}</span>
              <span className={`font-bold text-[var(--color-primary)] ${isText ? "text-sm leading-relaxed" : "text-lg"}`}>
                {results[output.id]}
                {output.unit && !isText && <span className="text-sm font-normal ml-1">{output.unit}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
