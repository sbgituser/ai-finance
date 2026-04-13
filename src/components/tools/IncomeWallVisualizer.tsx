"use client";

import { useState, useMemo } from "react";
import { incomeWalls, calcAnnualFromHourly, checkIncomeWalls } from "@/data/income-walls";
import { categoryLabel, categoryColor } from "@/data/income-walls";

export default function IncomeWallVisualizer() {
  const [hourlyWage, setHourlyWage] = useState(1100);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);

  const annualIncome = useMemo(
    () => calcAnnualFromHourly(hourlyWage, hoursPerWeek),
    [hourlyWage, hoursPerWeek],
  );

  const wallResults = useMemo(() => checkIncomeWalls(annualIncome), [annualIncome]);

  // Bar range: 0 to 2,200,000 (slightly above 201man)
  const barMax = 2_200_000;

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">時給（円）</span>
          <input
            type="number"
            min={800}
            max={5000}
            step={10}
            value={hourlyWage}
            onChange={(e) => setHourlyWage(Number(e.target.value))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">週の勤務時間（時間）</span>
          <input
            type="number"
            min={1}
            max={60}
            step={1}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none"
          />
        </label>
      </div>

      {/* Annual income display */}
      <div className="text-center bg-[var(--color-bg)] rounded-xl p-6 border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">あなたの推定年収</p>
        <p className="text-3xl font-bold text-[var(--color-primary)]">
          {annualIncome.toLocaleString()}
          <span className="text-base font-normal text-gray-500 ml-1">円</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">
          （約{Math.round(annualIncome / 10_000)}万円）
        </p>
      </div>

      {/* Visual bar */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">年収の壁マップ</h3>
        <div className="relative h-16 bg-gray-100 rounded-lg overflow-visible">
          {/* Income position indicator */}
          <div
            className="absolute top-0 h-full bg-[var(--color-primary)] opacity-15 rounded-l-lg transition-all duration-300"
            style={{ width: `${Math.min((annualIncome / barMax) * 100, 100)}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-[var(--color-primary)] transition-all duration-300 z-10"
            style={{ left: `${Math.min((annualIncome / barMax) * 100, 100)}%` }}
          />

          {/* Wall markers */}
          {incomeWalls.map((wall) => {
            const result = wallResults.find((r) => r.wallId === wall.id);
            const exceeded = result?.exceeded ?? false;
            const pos = (wall.beforeReform.threshold / barMax) * 100;
            return (
              <div
                key={wall.id}
                className="absolute top-0 h-full flex flex-col items-center"
                style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
              >
                <div
                  className={`w-1 h-full ${exceeded ? "bg-red-400" : "bg-green-400"}`}
                />
                <span
                  className={`absolute -bottom-6 text-[10px] font-medium whitespace-nowrap ${
                    exceeded ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {wall.threshold}万
                </span>
              </div>
            );
          })}
        </div>
        {/* Spacer for bottom labels */}
        <div className="h-4" />
      </div>

      {/* Wall status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {incomeWalls.map((wall) => {
          const result = wallResults.find((r) => r.wallId === wall.id);
          const exceeded = result?.exceeded ?? false;
          return (
            <div
              key={wall.id}
              className={`rounded-lg border p-3 transition-colors ${
                exceeded
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{wall.threshold}万円の壁</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[wall.category]}`}
                >
                  {categoryLabel[wall.category]}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                旧基準: {wall.beforeReform.threshold.toLocaleString()}円
              </p>
              <p
                className={`text-sm font-bold ${
                  exceeded ? "text-red-600" : "text-green-600"
                }`}
              >
                {exceeded ? "超えています" : "超えていません"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
