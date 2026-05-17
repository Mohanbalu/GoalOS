"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

interface TeamProgressData {
  name: string
  progress: number
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="bg-white dark:bg-slate-900 border border-border shadow-xl rounded-xl p-3 min-w-[150px] animate-in fade-in duration-200">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
          <div className="h-[1px] bg-border/40 w-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Avg Progress</span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-200">{item.progress}%</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function TeamProgressChart({ data }: { data: TeamProgressData[] }) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  if (data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-xs text-muted-foreground italic">
        No team progress analytics available.
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          onMouseMove={(state) => {
            if (state.activeTooltipIndex !== undefined) {
              setHoveredIndex(typeof state.activeTooltipIndex === 'number' ? state.activeTooltipIndex : null)
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            fontSize={11} 
            fontWeight={700}
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: "#64748b" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="progress" radius={[0, 8, 8, 0]} barSize={16}>
            {data.map((entry, index) => {
              const isHovered = hoveredIndex === index
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.progress > 80 ? "var(--primary)" : entry.progress > 50 ? "#3b82f6" : "#f59e0b"} 
                  fillOpacity={isHovered ? 1 : 0.85}
                  className="transition-all duration-300 cursor-pointer"
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
