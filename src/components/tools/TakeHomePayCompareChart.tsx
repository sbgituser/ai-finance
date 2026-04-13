"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { TakeHomePayResult } from "@/lib/tax-calc";

interface Props {
  data: TakeHomePayResult[];
}

function formatManYen(value: number) {
  return (value / 10_000).toLocaleString("ja-JP") + "万円";
}

export default function TakeHomePayCompareChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `${(d.annualIncome / 10_000).toLocaleString("ja-JP")}万`,
    手取り: d.annualTakeHome,
    控除: d.totalDeductions,
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            interval={1}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={(v: number) => `${(v / 10_000).toFixed(0)}万`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip formatter={(value) => formatManYen(Number(value))} />
          <Legend />
          <Bar dataKey="手取り" stackId="a" fill="#059669" />
          <Bar dataKey="控除" stackId="a" fill="#A7F3D0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
