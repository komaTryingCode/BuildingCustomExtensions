"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ShowFeedbackChartProps {
  trscore: number;
  ccscore: number;
  grscore: number;
  lrscore: number;
}

export default function ShowFeedbackChart({
  trscore,
  ccscore,
  grscore,
  lrscore,
}: ShowFeedbackChartProps) {
  const data = [
    {
      name: "Task Response",
      score: trscore,
    },
    {
      name: "Coherence & Cohesion",
      score: ccscore,
    },
    {
      name: "Grammar Range & Accuracy",
      score: grscore,
    },
    {
      name: "Lexical Resources",
      score: lrscore,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          domain={[0, 9]} // Set the domain from 0 to 9
        />
        <Tooltip />
        <Bar
          dataKey="score"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
