"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { TakeHomePayResult } from "@/lib/tax-calc";

interface Props {
  data: TakeHomePayResult;
}

const COLORS = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#047857"];

const LABELS = [
  "所得税",
  "住民税",
  "健康保険",
  "厚生年金",
  "雇用保険",
  "手取り",
] as const;

function formatYen(value: number) {
  return value.toLocaleString("ja-JP") + "円";
}

export default function TakeHomePayChart({ data }: Props) {
  const chartData = [
    { name: "所得税", value: data.incomeTax },
    { name: "住民税", value: data.residentTax },
    { name: "健康保険", value: data.healthInsurance },
    { name: "厚生年金", value: data.pensionInsurance },
    { name: "雇用保険", value: data.employmentInsurance },
    { name: "手取り", value: data.annualTakeHome },
  ];

  return (
    <div className="w-full h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name ?? ""} ${((percent ?? 0) * 100).toFixed(1)}%`
            }
            labelLine={true}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatYen(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
