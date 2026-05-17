"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Draft",
    total: Math.floor(Math.random() * 5) + 1,
  },
  {
    name: "Submitted",
    total: Math.floor(Math.random() * 5) + 1,
  },
  {
    name: "Approved",
    total: Math.floor(Math.random() * 5) + 1,
  },
  {
    name: "Revision",
    total: Math.floor(Math.random() * 2),
  },
]

export function GoalDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
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
        />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
