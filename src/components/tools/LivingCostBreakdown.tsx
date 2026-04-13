"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { MonthlyBudget } from "@/data/living-cost";

interface Props {
  monthlyBudget: MonthlyBudget;
}

const CATEGORIES: { key: keyof MonthlyBudget; label: string; color: string }[] = [
  { key: "rent",           label: "家賃",     color: "#EF4444" },
  { key: "food",           label: "食費",     color: "#F97316" },
  { key: "utilities",      label: "光熱費",   color: "#EAB308" },
  { key: "transportation", label: "交通費",   color: "#22C55E" },
  { key: "communication",  label: "通信費",   color: "#06B6D4" },
  { key: "insurance",      label: "保険料",   color: "#3B82F6" },
  { key: "entertainment",  label: "娯楽費",   color: "#8B5CF6" },
  { key: "savings",        label: "貯蓄",     color: "#059669" },
  { key: "other",          label: "その他",   color: "#6B7280" },
];

function formatYen(value: number) {
  return value.toLocaleString("ja-JP") + "円";
}

export default function LivingCostBreakdown({ monthlyBudget }: Props) {
  const chartData = CATEGORIES.map((c) => ({
    name: c.label,
    value: monthlyBudget[c.key],
    color: c.color,
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={130}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name ?? ""} ${((percent ?? 0) * 100).toFixed(1)}%`
            }
            labelLine={true}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatYen(value as number)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
