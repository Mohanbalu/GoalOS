"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts"

export function TeamBarChart({ data }: { data: { name: string, progress: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          fontSize={12}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Legend verticalAlign="top" height={36}/>
        <Bar 
          dataKey="progress" 
          radius={[4, 4, 0, 0]} 
          name="Avg. Completion"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.progress >= 80 ? "#10b981" : entry.progress >= 50 ? "#3b82f6" : "#f59e0b"} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
