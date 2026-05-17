"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="bg-white dark:bg-slate-900 border border-border shadow-xl rounded-xl p-4 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
            <div className={`h-2 w-2 rounded-full ${item.score > 85 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`} />
          </div>
          <div className="h-[1px] bg-border/40 w-full" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Completion Rate</span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">{item.score}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Governance Status</span>
              <span className={`text-[10px] font-black uppercase tracking-wider ${item.score > 85 ? 'text-emerald-600' : 'text-blue-600'}`}>Healthy</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function DepartmentBarChart({ data }: { data: { name: string, score: number }[] }) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          onMouseMove={(state) => {
            if (state.activeTooltipIndex !== undefined) {
              setHoveredIndex(typeof state.activeTooltipIndex === 'number' ? state.activeTooltipIndex : null)
            }
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e2e8f0" opacity={0.3} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false}
            tickLine={false}
            fontSize={11}
            fontWeight={700}
            width={120}
            stroke="#64748b"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
          <Bar 
            dataKey="score" 
            radius={[0, 8, 8, 0]} 
            barSize={32}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={hoveredIndex === index ? "#3b82f6" : (entry.score >= 85 ? "#10b981" : "#2563eb")} 
                fillOpacity={hoveredIndex === null || hoveredIndex === index ? 1 : 0.6}
                className="transition-all duration-300 cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
