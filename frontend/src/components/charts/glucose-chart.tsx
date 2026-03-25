"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartPoint } from "@/features/dashboard/types";

type Props = {
  data: ChartPoint[];
};

export function GlucoseChart({ data }: Props) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1a2540" strokeDasharray="4 4" />
          <XAxis
            dataKey="measuredAt"
            tickFormatter={(value) => new Date(value).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
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
            labelFormatter={(value) => new Date(value).toLocaleString("es-CO")}
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
