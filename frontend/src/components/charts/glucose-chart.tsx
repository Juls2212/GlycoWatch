"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartPoint } from "@/features/dashboard/types";

type Props = {
  data: ChartPoint[];
};

const axisDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

const tooltipDateFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "short",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});

function formatAxisLabel(value: string): string {
  return axisDateFormatter.format(new Date(value));
}

function formatTooltipLabel(value: string): string {
  return tooltipDateFormatter.format(new Date(value));
}

export function GlucoseChart({ data }: Props) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1a2540" strokeDasharray="4 4" />
          <XAxis
            dataKey="measuredAt"
            tickFormatter={formatAxisLabel}
            interval="preserveStartEnd"
            minTickGap={36}
            tick={{ fill: "#8fa7d5", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: "#8fa7d5", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0f1626",
              border: "1px solid #25314d",
              borderRadius: "12px",
              color: "#dce8ff"
            }}
            labelFormatter={(value) => formatTooltipLabel(String(value))}
            formatter={(value: number) => [`${value} mg/dL`, "Glucosa"]}
          />
          <Line
            type="monotone"
            dataKey="glucoseValue"
            stroke="#4da3ff"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: "#8ec4ff" }}
            isAnimationActive
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
