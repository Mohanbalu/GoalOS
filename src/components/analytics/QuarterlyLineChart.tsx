"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function QuarterlyLineChart({ data }: { data: { name: string, progress: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          fontSize={12}
          tickMargin={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36}/>
        <Line 
          type="monotone" 
          dataKey="progress" 
          stroke="#2563eb" 
          strokeWidth={2}
          dot={{ r: 4, fill: "#2563eb" }}
          activeDot={{ r: 6 }}
          name="Avg. Completion"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
