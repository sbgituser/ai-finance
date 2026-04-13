"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { YearlyData } from "@/lib/investment-calc";

interface Props {
  yearlyBreakdown: YearlyData[];
}

function formatMan(value: number) {
  return (value / 10_000).toLocaleString("ja-JP") + "万円";
}

export default function InvestmentReturnChart({ yearlyBreakdown }: Props) {
  const chartData = yearlyBreakdown.map((d) => ({
    year: `${d.year}年`,
    元本: d.invested,
    運用益: d.profit,
    合計: d.value,
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatMan} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value, name) => [
              Number(value).toLocaleString("ja-JP") + "円",
              String(name),
            ]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="元本"
            stackId="1"
            stroke="#3B82F6"
            fill="#93C5FD"
            name="元本"
          />
          <Area
            type="monotone"
            dataKey="運用益"
            stackId="1"
            stroke="#059669"
            fill="#6EE7B7"
            name="運用益"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
